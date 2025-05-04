'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DanhGia', {
      maDanhGia: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maNguoiDung: {
        type: Sequelize.INTEGER
      },
      maSanPham: {
        type: Sequelize.INTEGER
      },
      xepHang: {
        type: Sequelize.INTEGER
      },
      noiDung: {
        type: Sequelize.STRING
      },
      ngayDanhGia: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('DanhGia');
  }
};