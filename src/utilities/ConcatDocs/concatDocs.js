export default function concatDocs(docs) {
  let flat = docs.filter((doc) => !!doc.length);

  if (flat.length) {
    flat = flat.reduce((acc, el) => {
      return acc.concat(el);
    });
  }

  return flat;
}
