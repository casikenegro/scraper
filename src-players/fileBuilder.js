const Excel = require('exceljs');

const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const toHeader = async (requirements) => {
    return requirements.reduce((acc, cur) => {
        acc.push({
            header: cur,
            key: cur
        });
        return acc;
    }, []);
};

const buildFile = async (data, fileName, requirements) => {
    requirements = ['Agent', ...requirements];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Scrap');

    worksheet.columns = await toHeader(requirements);
    worksheet.getRow(1).font = { bold: true }

    Object.keys(data).forEach(key => {
        data[key].forEach(client => {
            worksheet.addRow({
                Agent: key,
                ...client
            });
        });
    });

    worksheet.columns.forEach(column => {
        column.width = 25;
    })

    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        worksheet.getCell(`A${rowNumber}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'none' }
        };

        const insideColumns = alpha.slice(0, requirements.length - 1);

        insideColumns.forEach((v) => {
            worksheet.getCell(`${v}${rowNumber}`).border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'none' },
                right: { style: 'none' }
            }
        })

        const column = alpha[requirements.length - 1];

        worksheet.getCell(`${column}${rowNumber}`).border = {
            top: { style: 'thin' },
            left: { style: 'none' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    })

    worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'B2' }
    ];
    
    workbook.xlsx.writeFile(fileName);

    return `file "${fileName}" has been created`;
};

module.exports = buildFile;