import MTProtoClient from "ROOT/lib/mtproto";

function formatMessage (message, limit = -1) {
  const entities = message.entities || [];
  let text = message.message || '';
  if (limit !== -1) {
    text = text.slice(0, limit);
  }
  const textLn = text.length;
  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i];
    switch (e._) {
      case 'messageEntityBold':
        if (e.offset <= textLn) {
          text = text.slice(0, e.offset) + '<b>'
            + text.slice(e.offset, e.offset + e.length) + '</b>'
            + text.slice(e.offset + e.length);
        }
        break;
    }
  }
  return text;
}

function getPhoto (peer, loc) {
  return new Promise((resolve, reject) => {
    const params = {
      flags: 0,
      precise: false,
      location: {
        _: 'inputPeerPhotoFileLocation',
        flags: 0,
        big: false,
        peer: peer,
        volume_id: loc.volume_id,
        local_id: loc.local_id
      },
      offset: 0,
      limit: 1024 * 1024,
    };

    let bytes = [];

    const fnGetParts = () => {
      _getFilePart(params)
        .then((data) => {
          if (data.type._ === 'storage.filePartial') {
            params.offset += params.limit;
            if (data.bytes.length) {
              bytes.push(data.bytes);
              fnGetParts();
            } else {
              bytes = Array.prototype.concat.apply([], bytes);
              const blob = new Blob(bytes, {type: 'image/png'});
              resolve(URL.createObjectURL(blob));
            }
          } else {
            debugger;
          }
        })
        .catch((err) => {
          reject(err);
        });
    };
    fnGetParts();
  })
}

function _getFilePart (params) {
  return new Promise((resolve, reject) => {
    MTProtoClient('upload.getFile', params)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  })
}

export { formatMessage, getPhoto };
