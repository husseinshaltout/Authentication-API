import nanoid from 'nanoid/async';

const generateNanoId = nanoid.customAlphabet(
  '346789ABCDEFGHJKLMNPQRTUVWXY',
  12
);

export default generateNanoId;
