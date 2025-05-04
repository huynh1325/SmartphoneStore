'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DiaChi', {
      maDiaChi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maNguoiDung: {
        type: Sequelize.INTEGER,
        unique: true
      },
      tinhThanh: {
        type: Sequelize.STRING,
      },
      quanHuyen: {
        type: Sequelize.STRING,
      },
      phuongXa: {
        type: Sequelize.STRING,
      },
      diaChiChiTiet: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DiaChi');
  }
};