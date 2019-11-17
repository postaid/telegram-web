import MTProtoClient from "ROOT/lib/mtproto";

function formatMessage (message, limit = -1) {
  const entities = message.entities || [];
  let text = message.message || '';
  if (limit !== -1) {
    text = text.slice(0, limit);
  }

  const ents = [];
  // todo: add other entities, check algo
  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i];
    switch (e._) {
      case 'messageEntityBold':
        ents.push([e.offset, '<b>'], [e.offset + e.length, '</b>'])
        break;
    }
  }
  ents.sort((a, b) => a[0] - b[0]);
  let resText = ''
  let index = 0;
  for (let i = 0; i < ents.length; i++) {
    const ent = ents[i];
    resText += text.slice(index, ent[0]) + ent[1];
    index = ent[0];
  }
  if (index < text.length) {
    resText += text.slice(index);
  }
  return resText;
}

const photos = {};
const photosPending = {};

function getPhoto ([id, peer, loc, dc_id]) {
  return new Promise((resolve, reject) => {
    if (photos[id]) {
      resolve(photos[id]);
    } else if (photosPending[id]) {
      photosPending[id].then(data => {
        resolve(data);
        return data;
      });
    } else {
      photosPending[id] = _getPhoto(peer, loc, dc_id)
        .then((data) => {
          photos[id] = data;
          photosPending[id] = null;
          resolve(data);
          return data;
        })
        .catch(err => {
          photosPending[id] = null;
          reject(err);
          return err;
        });
    }
  });
}

function _getPhoto (peer, loc, dcID) {
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
    const options = {};
    if (dcID) {
      options.dcID = dcID;
    }
    options.createNetworker = true;
    let bytes = [];

    const fnGetParts = () => {
      _getFilePart(params, options)
        .then((data) => {
          switch (data.type._) {
            case 'storage.fileUnknown':
              resolve(URL.createObjectURL(new Blob([bytes])));
              break;
            case 'storage.filePartial':
              params.offset += params.limit;
              const bytesCount = data.bytes.length;
              if (bytesCount) {
                bytes.push(data.bytes);
                if (bytesCount < params.limit) {
                  const blob = new Blob(bytes);
                  resolve(URL.createObjectURL(blob));
                } else {
                  fnGetParts();
                }
              } else {
                fnGetParts();
              }
              break;
            default:
              const type = data.type._.replace('storage.file', '');
              const blob = new Blob([data.bytes], { type: 'image/' + type.toLowerCase() });
              const url = URL.createObjectURL(blob)
              resolve(url);
              break;
          }
        })
        .catch(err => reject(err));
    };
    fnGetParts();
  });
}

function _getFilePart (params, options) {
  return new Promise((resolve, reject) => {
    MTProtoClient('upload.getFile', params, options)
      .then(data => resolve(data))
      .catch(err => reject(err));
  })
}

export { formatMessage, getPhoto };
