module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'wsy021031',
    database: 'homeworkCollectionSystem',
    insecureAuth: false,
    charset: 'utf8mb4',
    synchronize: true, // 设置为 true 将在每次应用程序启动时自动创建数据库表（仅用于开发环境）
    logging: true, // 设置为 true 将启用 SQL 查询日志
    entities: ['src/entities/*.entity.ts'], // 根据你的项目结构配置实体类的路径
    pool: {
      max: 10, // 连接池中最大连接数
      min: 2, // 连接池中最小连接数
    },
  };
  