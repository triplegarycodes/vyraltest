import * as SQLite from 'expo-sqlite';

let database = null;

export const getDatabase = () => {
  if (!database) {
    database = SQLite.openDatabase('vyral.db');
  }
  return database;
};

export const runStatement = (sql, params = []) =>
  new Promise((resolve, reject) => {
    const db = getDatabase();
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      reject
    );
  });

export const initNotesTable = () =>
  runStatement('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)');

export const fetchNotes = async () => {
  const result = await runStatement('SELECT id, text FROM notes ORDER BY id DESC');
  return result?.rows?._array ?? [];
};

export const insertNote = async (text) => {
  await runStatement('INSERT INTO notes (text) VALUES (?)', [text]);
  return fetchNotes();
};

export const deleteNote = async (id) => {
  await runStatement('DELETE FROM notes WHERE id = ?', [id]);
  return fetchNotes();
};
