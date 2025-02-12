const { Pool } = require('pg');
const { InvariantError } = require('../ecxeptions/InvariantError');
const { NotFoundError } = require('../ecxeptions/NotFoundError');

class PostgresService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ id, title, year, performer, genre, duration, albumId }) {
    const query = {
      text: 'INSERT INTO song (id, title, year, performer, genre, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    try {
      await this._pool.query(query);
    } catch {
      throw new InvariantError('Failed to add song');
    }
  }

  async getAllSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM song');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }

    return result.rows[0];
  }

  async updateSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: `UPDATE song SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7`,
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update song. Song not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete song. Song not found');
    }
  }

  async addAlbum({ id, name, year }) {
    const query = {
      text: 'INSERT INTO album (id, name, year) VALUES ($1, $2, $3)',
      values: [id, name, year],
    };

    try {
      await this._pool.query(query);
    } catch {
      throw new InvariantError('Failed to add album');
    }
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album not found');
    }

    const querySongs = {
      text: 'SELECT id, title, performer FROM song WHERE album_id = $1',
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);

    const album = result.rows[0];
    album.songs = resultSongs.rows;

    return album;
  }

  async updateAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update album. Album not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete album. Album not found');
    }
  }
}

module.exports = PostgresService;
