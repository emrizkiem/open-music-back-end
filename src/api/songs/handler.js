const { nanoid } = require('nanoid');
const autoBind = require('auto-bind');
const NotFoundError = require('../../ecxeptions/InvariantError');
const Validator = require('../../validator');

class SongsHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async addSongHandler(request, h) {
    Validator.validateSongPayload(request.payload);

    const { title, year, performer, genre, duration, albumId } = request.payload;
    const id = `song-${nanoid(16)}`;
    await this._service.addSong({ id, title, year, performer, genre, duration, albumId });

    return h.response({
      status: 'success',
      message: 'Song added successfully',
      data: { songId: id },
    }).code(201);
  }

  async getAllSongsHandler(request, h) {
    const { title = '', performer = '' } = request.query;
    Validator.validateSongQuery({ title, performer });
    const songs = await this._service.getAllSongs();

    const filteredSongs = songs.filter((song) => {
      const titleMatch = title === '' || song.title.toLowerCase().includes(title.toLowerCase());
      const performerMatch = performer === '' || song.performer.toLowerCase().includes(performer.toLowerCase());
      return titleMatch && performerMatch;
    });

    return h.response({
      status: 'success',
      data: {
        songs: filteredSongs,
      },
    });
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    if (!song) {
      throw new NotFoundError('Song not found');
    }

    return {
      status: 'success',
      data: { song },
    };
  }

  async updateSongByIdHandler(request) {
    Validator.validateSongPayload(request.payload);

    const { id } = request.params;
    const { title, year, performer, genre, duration, albumId } = request.payload;

    await this._service.updateSongById(id, { title, year, performer, genre, duration, albumId });

    return {
      status: 'success',
      message: 'Song updated successfully',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song deleted successfully',
    };
  }
}

module.exports = SongsHandler;