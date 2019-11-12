function formatMessage (message, limit = -1) {
  const entities = message.entities;
  let text = message.message || '';
  if (limit !== -1) {
    text = text.slice(0, limit);
  }
  const textLn = text.length;
  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i];
    switch(e._) {
      case 'messageEntityBold':
        if (e.offset <= textLn) {
          message = message.slice(0, e.offset) + '<b>'
            + message.slice(e.offset, e.offset + e.length) + '</b>'
            + message.slice(e.offset + e.length);
        }
        break;
    }
  }
  return text;
}

export { formatMessage };
