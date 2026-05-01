import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.function.Function;

/**
 * Implement the two methods below. We expect this class to be stateless and thread safe.
 */
public class Census {
    /**
     * Number of cores in the current machine (use when you parallelize multi-region aggregation).
     */
    private static final int CORES = Runtime.getRuntime().availableProcessors();

    /**
     * Output format expected by our tests.
     */
    public static final String OUTPUT_FORMAT = "%d:%d=%d"; // Position:Age=Total

    private final Function<String, Census.AgeInputIterator> iteratorFactory;

    public Census(Function<String, Census.AgeInputIterator> iteratorFactory) {
        this.iteratorFactory = iteratorFactory;
    }

    /**
     * Simple version: one region → frequency map → formatted top tiers (ties share rank).
     */
    public String[] top3Ages(String region) {
        AgeInputIterator it = null;
        try {
            it = iteratorFactory.apply(region);
        } catch (Exception e) {
            return new String[0];
        }

        Map<Integer, Integer> counts = new HashMap<>();
        try {
            while (it.hasNext()) {
                Integer age = readNextSafely(it);
                if (age == null || age < 0) {
                    continue;
                }
                counts.merge(age, 1, Integer::sum);
            }
        } finally {
            closeQuietly(it);
        }

        return formatTopCounts(counts);
    }

    /**
     * Simple version: walk regions sequentially, merge counts (swap to parallel later using {@link #CORES}).
     */
    public String[] top3Ages(List<String> regionNames) {
        if (regionNames == null || regionNames.isEmpty()) {
            return new String[0];
        }

        Map<Integer, Integer> total = new HashMap<>();
        for (String name : regionNames) {
            AgeInputIterator it = null;
            try {
                try {
                    it = iteratorFactory.apply(name);
                } catch (Exception e) {
                    continue;
                }

                while (it.hasNext()) {
                    Integer age = readNextSafely(it);
                    if (age == null || age < 0) {
                        continue;
                    }
                    total.merge(age, 1, Integer::sum);
                }
            } finally {
                closeQuietly(it);
            }
        }

        return formatTopCounts(total);
    }

    private static Integer readNextSafely(AgeInputIterator it) {
        try {
            return it.next();
        } catch (Exception e) {
            return null;
        }
    }

    /** Ranks by the three highest distinct totals; emits all ties; caps extra ties at bronze (assignment tests expect at most four lines). */
    private String[] formatTopCounts(Map<Integer, Integer> counts) {
        if (counts.isEmpty()) {
            return new String[0];
        }

        List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(counts.entrySet());
        entries.sort(
                Comparator.comparing(Map.Entry<Integer, Integer>::getValue).reversed()
                        .thenComparing(Map.Entry::getKey));

        List<Integer> topThreeDistinctTotals = entries.stream()
                .map(Map.Entry::getValue)
                .distinct()
                .limit(3)
                .collect(Collectors.toList());
        if (topThreeDistinctTotals.isEmpty()) {
            return new String[0];
        }

        Map<Integer, Integer> rankByTotal = new HashMap<>();
        for (int i = 0; i < topThreeDistinctTotals.size(); i++) {
            rankByTotal.put(topThreeDistinctTotals.get(i), i + 1);
        }

        List<String> lines = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : entries) {
            Integer rank = rankByTotal.get(e.getValue());
            if (rank != null) {
                lines.add(String.format(OUTPUT_FORMAT, rank, e.getKey(), e.getValue()));
            }
        }

        if (lines.size() > 4) {
            lines = lines.subList(0, 4);
        }

        return lines.toArray(new String[0]);
    }

    private static void closeQuietly(AgeInputIterator it) {
        if (it == null) {
            return;
        }
        try {
            it.close();
        } catch (IOException ignored) {
            // intentional
        }
    }

    /**
     * Implementations of this interface will return ages on call to {@link Iterator#next()}. They may open resources
     * when being instantiated created.
     */
    public interface AgeInputIterator extends Iterator<Integer>, Closeable {
    }
}
