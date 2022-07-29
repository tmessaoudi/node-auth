import postgres from 'postgres'

const sql = postgres() // will use psql environment variables

export default sql

