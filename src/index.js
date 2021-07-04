const fs = require('fs');
const XLSX = require('xlsx')

const month = 'DEZ'

const months = [
    'ABR',
    'AGO',
    'DEZ',
    'JUL',
    'MAR',
    'OUT',
    'SET',
]

for( let month of months){
    const workbook = XLSX.readFile(`/Users/gabrielvfmelo/Documents/development/projects/notas_corretagem/src/plans/${month}.xlsx`)

// console.log(workbook.Sheets)

let worksheets = {};
for (const sheetName of workbook.SheetNames) {

    // Some helper functions in XLSX.utils generate different views of the sheets:
    //     XLSX.utils.sheet_to_csv generates CSV
    //     XLSX.utils.sheet_to_txt generates UTF16 Formatted Text
    //     XLSX.utils.sheet_to_html generates HTML
    //     XLSX.utils.sheet_to_json generates an array of objects
    //     XLSX.utils.sheet_to_formulae generates a list of formulae
    worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

let notesArr = worksheets.Sheet1



// console.log(notesArr)




const dtOperation = []



function getDayTradeStockOperation(){
    let imposto;
    notesArr.forEach(element => {
        if (element.POSITION === 'ZERADA' && element.CODIGO.length <= 8){


            const compra = parseFloat((element.PMC).replace(',', '.'))
            const venda = parseFloat((element.PMV).replace(',', '.'))
  
            const qtdVenda = parseInt((element.VENDA))


            if((compra - venda) < 0){

                const diferenca = (compra - venda) * -1
           
                imposto = ((diferenca * qtdVenda) * 0.2)
        
            }
            dtOperation.push({element, imposto})
        }
    });
}


//////////////// OPCOES ///////////////////////////////

const optionOperations = []

function getOptionsOperations(){
    let imposto;
    notesArr.forEach(element => {
        element.CODIGO.replace(/\s+/g, '')
        if (element.CODIGO.length > 7){
            // console.log(element)
        if(element.POSITION === 'ZERADA'){
            const compra = parseFloat((element.PMC).replace(',', '.'))
            const venda = parseFloat((element.PMV).replace(',', '.'))
  
            const qtdVenda = parseInt((element.VENDA))


            if((compra - venda) < 0){

                const diferenca = (compra - venda) * -1
           
                imposto = ((diferenca * qtdVenda) * 0.2)
        
            } else {
                imposto = 0
            }
            optionOperations.push({element, imposto})
        } 

        
            // console.log(element)
    

        }
    });
}


const getSwingTradeTaxes = () => {
    let imposto;
    let vendas = [];
    notesArr.forEach(element => {
        if (element.POSITION === 'VENDIDA' && element.CODIGO.length <= 8){
            vendas.push({element})
        }

    });



    let vendasTotal=0;

 

    for (let i of vendas){
        vendasTotal += (parseInt(i.element.VENDA) * (parseFloat(i.element.PMV.replace(',', '.'))))
    }
   


    if(vendasTotal < 20000){
        console.log(`Livre de imposto em ${month}, pois seu total de vendas foi ${vendasTotal}`)
    } else {
        console.log(`O total de imposto para ${month} e de ${vendasTotal} BRL`)
    }
}






const getOptionsTradeTaxes = () => {
    let imposto;
    let vendas = [];
    notesArr.forEach(element => {
        if (element.CODIGO.length >= 8){
            console.log(`Meses com negociacoes em opcoes:${month}`)
            vendas.push({element})
        }

    });

    

    let totalDeCompras=0;

    let totaldeVendas=0;

    let totalZeradas=0; 

    for (let i of vendas){
        if(i.element.POSITION === 'VENDIDA'){
            totaldeVendas += (parseInt(i.element.VENDA) * (parseFloat(i.element.PMV.replace(',', '.'))))
        } else if(i.element.POSITION === 'COMPRADA'){
            totalDeCompras += (parseInt(i.element.COMPRA) * (parseFloat(i.element.PMC.replace(',', '.'))))
        } else {
            totalZeradas += (parseInt(i.element.COMPRA) * (parseFloat(i.element.PMC.replace(',', '.'))) - parseInt(i.element.VENDA) * (parseFloat(i.element.PMV.replace(',', '.'))))
        }
    }
   
    console.log(`${totalDeCompras}, ${totaldeVendas}, ${totalZeradas}, ${month}`)

    // console.log(`Em ${month} voce vendeu ${totaldeVendas} e comprou ${totalDeCompras}`)

    // if(totalDeCompras < resultVendas){
    //     console.log(`Livre de imposto em ${month}, pois seu mes terminou em ${totalDeCompras - resultVendas} BRL`)
    // } else {
    //     console.log(`O total de imposto para ${month} e de ${resultVendas} BRL`)
    // }
}

// getSwingTradeTaxes()
// getDayTradeStockOperation()
// console.log(dtOperation)
getOptionsTradeTaxes()
// console.log(optionOperations)
}
