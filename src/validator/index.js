const {
  AlbumPayloadSchema,
  SongPayloadSchema,
  SongQuerySchema
} = require('./schema');
const InvariantError = require('../ecxeptions/InvariantError');

const Validator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },

  validateSongPayload: (payload) => {
    const { error } = SongPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },

  validateSongQuery: (payload) => {
    const { error } = SongQuerySchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  }
};

module.exports = Validator;