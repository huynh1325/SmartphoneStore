'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HoaDon', {
      maHoaDon: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maDonHang: {
        type: Sequelize.INTEGER
      },
      maNguoiDung: {
        type: Sequelize.INTEGER
      },
      ngayBan: {
        type: Sequelize.DATE
      },
      hinhThucThanhToan: {
        type: Sequelize.STRING
      },
      tongGia: {
        type: Sequelize.DECIMAL(10, 2)
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
    await queryInterface.dropTable('HoaDon');
  }
};