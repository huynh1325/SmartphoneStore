'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SanPham', {
      maSanPham: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      tenSanPham: {
        type: Sequelize.STRING
      },
      gia: {
        type: Sequelize.DECIMAL(15, 2)
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
      chipDoHoa: {
        type: Sequelize.STRING
      },
      theNho: {
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