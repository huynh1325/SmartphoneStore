const generateCustomId = async (prefix, model, fieldName, length = 4) => {
    const lastRecord = await model.findOne({
        order: [[fieldName, 'DESC']],
        attributes: [fieldName],
        raw: true,
    });

    let nextNumber = 1;
    if (lastRecord && lastRecord[fieldName]) {
        const lastNumber = parseInt(lastRecord[fieldName].replace(prefix, '')) || 0;
        nextNumber = lastNumber + 1;
    }

    const paddedNumber = String(nextNumber).padStart(length, '0');
    return `${prefix}${paddedNumber}`;
};

module.exports = {
    generateCustomId,
};