//Hàm nhận vào một chuỗi và loại bỏ các dấu thanh (dấu diacritics) khỏi các ký tự tiếng Việt
export const removeAccents = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
//Hàm nhận vào một chuỗi token JWT và trả về phần dữ liệu được giải mã từ token đó
export const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
//Hàm nhận vào một hình ảnh và một hàm callback
export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
//Hàm nhận vào một số và trả về chuỗi biểu diễn số đó với dấu phẩy ngăn cách các hàng nghìn
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
