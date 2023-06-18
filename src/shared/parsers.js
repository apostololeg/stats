export const parseId = id => parseInt(id, 10);

export const parseIds = (_obj, ids) => {
  const obj = { ..._obj };

  ids.forEach(name => {
    if (typeof obj[name] === 'string') obj[name] = parseId(obj[name]);
  });

  return obj;
};
