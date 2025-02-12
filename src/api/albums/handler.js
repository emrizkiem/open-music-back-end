const { nanoid } = require('nanoid');
const autoBind = require('auto-bind');
const NotFoundError = require('../../ecxeptions/InvariantError');
const Validator = require('../../validator');

class AlbumsHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async addAlbumHandler(request, h) {
    Validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const id = `album-${nanoid(16)}`;
    await this._service.addAlbum({ id, name, year });

    return h.response({
      status: 'success',
      message: 'Album added successfully',
      data: { albumId: id },
    }).code(201);
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    if (!album) {
      throw new NotFoundError('Album not found');
    }

    return {
      status: 'success',
      data: { album },
    };
  }

  async updateAlbumByIdHandler(request) {
    Validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;
    await this._service.updateAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album updated successfully',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album deleted successfully',
    };
  }
}

module.exports = AlbumsHandler;