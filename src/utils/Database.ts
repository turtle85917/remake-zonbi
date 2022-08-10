import knex from "knex";

export const database = knex({
    client: "sqlite3",
    connection: {
        filename: `${process.cwd()}/src/data/data.db`
    }
});

/**
 * 테이블을 생성합니다.
 */
export async function createTable(tableName: string, callback: any): Promise<void> {
    await database.schema.createTable(tableName, callback);
}

/**
 * 테이블이 존재하는 지, 확인합니다.
 */
export async function hasTable(tableName: string): Promise<boolean> {
    return database.schema.hasTable(tableName);
}

/**
 * 해당 테이블에 있는 모든 값을 배열로 반환힙니다.
 */
export async function getAllData(tableName): Promise<any[]> {
    return (await database(tableName).select("*"));
}