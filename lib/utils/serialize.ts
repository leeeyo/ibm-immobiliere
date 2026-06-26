export function serializeDoc(doc: any) {
  if (!doc) return null;

  // convert to plain object if it's a mongoose document
  const raw = doc.toObject ? doc.toObject() : { ...doc };

  function clean(value: any): any {
    if (value === null || value === undefined) return value;
    // Dates -> ISO string
    if (value instanceof Date) return value.toISOString();
    // Buffers / Uint8Array -> base64 string
    if (typeof Buffer !== 'undefined' && value instanceof Buffer) return Buffer.from(value).toString('base64');
    if (value instanceof Uint8Array) return Buffer.from(value).toString('base64');
    // Arrays -> clean each
    if (Array.isArray(value)) return value.map((v) => clean(v));
    // Objects -> recurse, and map _id to id
    if (typeof value === 'object') {
      const out: any = {};
      for (const k of Object.keys(value)) {
        if (k === '_id') {
          out.id = String((value as any)[k]);
        } else if (k === '__v') {
          // skip mongoose meta
          continue;
        } else {
          out[k] = clean((value as any)[k]);
        }
      }
      return out;
    }
    // primitive
    return value;
  }

  const cleaned = clean(raw);
  // ensure top-level id field exists if _id was present
  if (!cleaned.id && (raw as any)._id) cleaned.id = String((raw as any)._id);
  return cleaned;
}

export function serializeDocs(docs: any[]) {
  return docs.map((d) => serializeDoc(d));
}
