import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('Online_store', 'root', 'poiuytrewq09', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false
  }
});

export default sequelize;