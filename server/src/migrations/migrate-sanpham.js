'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SanPham', {
      maSanPham: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tenSanPham: {
        type: Sequelize.STRING
      },
      gia: {
        type: Sequelize.DECIMAL(10, 2)
      },
      moTa: {
        type: Sequelize.STRING
      },
      anh: {
        type: Sequelize.STRING
      },
      heDieuHanh: {
        type: Sequelize.STRING
      },
      cpu: {
        type: Sequelize.STRING
      },
      inch: {
        type: Sequelize.STRING
      },
      phanTramGiam: {
        type: Sequelize.INTEGER
      },
      nhanHieu: {
        type: Sequelize.STRING
      },
      nuocSanXuat: {
        type: Sequelize.STRING
      },
      ram: {
        type: Sequelize.STRING
      },
      dungLuongLuuTru: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('SanPham');
  }
};