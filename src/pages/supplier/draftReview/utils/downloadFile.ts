export async function downloadLog() {
  const a = document.createElement('a');
  a.setAttribute('download', '');
  a.setAttribute('href', '/supplier/v1/product_temp/excel');
  a.click();
}
