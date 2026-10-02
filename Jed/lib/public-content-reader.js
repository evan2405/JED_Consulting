// One reader per server render. Only explicitly allowed public projections can
// enter a batch; no data or promises are retained across visitor requests.
export function createPublicContentReader(queries, fetchBatch) {
  const reads = new Map();
  let pending = [];

  async function flush() {
    const batch = pending;
    pending = [];
    const query = `{${batch.map(({ kind }) => `${JSON.stringify(kind)}:(${queries[kind]})`).join(",")}}`;
    try {
      const result = await fetchBatch(query);
      for (const { kind, resolve, reject } of batch) {
        if (result && Object.hasOwn(result, kind)) resolve(result[kind]);
        else reject(new Error("Incomplete public content response"));
      }
    } catch (error) {
      for (const { reject } of batch) reject(error);
    }
  }

  return function read(kind) {
    if (!Object.hasOwn(queries, kind))
      throw new Error("Unknown public collection");
    if (!reads.has(kind)) {
      reads.set(
        kind,
        new Promise((resolve, reject) => {
          pending.push({ kind, resolve, reject });
          if (pending.length === 1) queueMicrotask(flush);
        }),
      );
    }
    return reads.get(kind);
  };
}
