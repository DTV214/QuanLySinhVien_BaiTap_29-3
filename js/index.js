import { validateNhanVien } from "./validate.js";

const KEY_LOCAL = "arrNhanVien";
let arrNhanVien = getDataNhanVienLocal();
let arrFilterLoaiNhanVien = [];
renderListNhanVien();

function layDuLieuTuForm(form) {
  if (!form || !(form instanceof HTMLFormElement)) {
    console.error("Lỗi: Không tìm thấy form hợp lệ!");
    return null;
  }

  let formData = new FormData(form);
  let nhanVien = Object.fromEntries(formData);
  return nhanVien;
}

// Sự kiện onclick thêm nhân viên
document.getElementById("btnThemNV").onclick = function (e) {
  e.preventDefault();
  // let arrField = document.querySelectorAll("#myModal input, #myModal select");
  // let nhanVien = {};
  // for (let field of arrField) {
  //   let { id, value } = field;
  //   nhanVien[id] = value;
  // }
  let form = document.getElementById("formNhanVien");
  let nhanVien = layDuLieuTuForm(form);

  if (!validateNhanVien(nhanVien)) {
    alert("Vui lòng kiểm tra lại thông tin nhập vào!");
    console.error("Dữ liệu nhập vào không hợp lệ!");
    return;
  }

  // Chuyển đổi dữ liệu về kiểu số
  nhanVien.luongCB = parseFloat(nhanVien.luongCB) || 0;
  nhanVien.gioLam = parseInt(nhanVien.gioLam) || 0;

  assignMethods(nhanVien);
  arrNhanVien.push(nhanVien);
  saveDataNhanVien();
  renderListNhanVien();
  // e.target.reset();
  alert("Thêm nhân viên thành công!");
};

//Fix lỗi: Gán lại các phương thức sau khi lấy từ localStorage
function assignMethods(nhanVien) {
  nhanVien.tongLuongNhanVien = function () {
    let multiplier = 1;
    switch (this.chucvu) {
      case "Sếp":
        multiplier = 3;
        break;
      case "Trưởng phòng":
        multiplier = 2;
        break;
      case "Nhân viên":
        multiplier = 1;
        break;
    }
    return this.luongCB * multiplier;
  };

  nhanVien.loaiNhanVien = function () {
    if (this.gioLam >= 192) {
      return "Xuất sắc";
    } else if (this.gioLam >= 176) {
      return "Giỏi";
    } else if (this.gioLam >= 160) {
      return "Khá";
    } else {
      return "Trung bình";
    }
  };
}

function renderListNhanVien(arr = arrNhanVien) {
  let content = "";

  arr = arr.filter((nv) => nv); // Lọc bỏ nhân viên null hoặc undefined

  for (let nhanVien of arr) {
    assignMethods(nhanVien); // Fix lỗi bị mất phương thức sau khi lấy từ localStorage

    content += `<tr>
      <td>${nhanVien.tknv}</td>
      <td>${nhanVien.name}</td>
      <td>${nhanVien.email}</td>
      <td>${nhanVien.ngaylam}</td>
      <td>${nhanVien.chucvu}</td>
      <td>${nhanVien
        .tongLuongNhanVien()
        .toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
      <td>${nhanVien.loaiNhanVien()}</td>
      <td>
        <button onclick="xoaNhanVien('${
          nhanVien.tknv
        }')" class="btn btn-danger">Xoá</button>
        <button onclick="layThongTinNhanVien('${
          nhanVien.tknv
        }')" class="btn btn-warning">Sửa</button>
      </td>
    </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = content;
}

// *Lưu dữ liệu vào localStorage
function saveDataNhanVien() {
  localStorage.setItem(KEY_LOCAL, JSON.stringify(arrNhanVien));
}

// Lấy dữ liệu từ localStorage & FIX lỗi mất function
function getDataNhanVienLocal() {
  let dataLocal = localStorage.getItem(KEY_LOCAL);
  let arr = dataLocal ? JSON.parse(dataLocal) : [];

  arr = arr.filter((nv) => nv);

  arr.forEach(assignMethods);
  return arr;
}

//Xoa Nhan Vien
function xoaNhanVien(tk) {
  console.log(tk);
  let newArrFilter = arrNhanVien.filter((nhanVien) => {
    return nhanVien.tknv != tk;
  });
  arrNhanVien = newArrFilter;
  saveDataNhanVien();
  renderListNhanVien();
}
//Cập nhật thông tin

function layThongTinNhanVien(tk) {
  console.log("hi");
  let nhanVien = arrNhanVien.find((nhanVien) => {
    return nhanVien.tknv === tk;
  });
  if (!nhanVien) {
    console.error("Không tìm thấy nhân viên!");
    return;
  }

  if (nhanVien) {
    console.log(nhanVien);
    let arrField = document.querySelectorAll("#myModal input, #myModal select");
    console.log(arrField);
    for (let field of arrField) {
      let { name } = field;
      field.value = nhanVien[name];
      if (name === "tknv") {
        field.readOnly = true;
      }
    }
  }
  // document.getElementById("btnCapNhat").dataset.editingTK
  $("#myModal").modal("show");
}
function capNhatThongTinNhanVien() {
  let form = document.querySelector("#myModal form");
  let nhanVien = layDuLieuTuForm(form);
  console.log(nhanVien);
  let viTriCanTim = arrNhanVien.findIndex((item) => {
    return item.tknv === nhanVien.tknv;
  });
  if (viTriCanTim != -1) {
    arrNhanVien[viTriCanTim] = nhanVien;
    saveDataNhanVien();
    renderListNhanVien();
    form.reset;
    document.getElementById("tknv").readOnly = false;
    $("#myModal").modal("hide");
  } else {
    console.error("Không tìm thấy nhân viên cần cập nhật!");
  }
}
document.getElementById("btnCapNhat").onclick = capNhatThongTinNhanVien;

//Search
document.getElementById("searchName").oninput = function (event) {
  let keyWord = removeVietnameseTones(event.target.value.toLowerCase());
  //filter
  let arrFilter = arrNhanVien.filter((nhanVien, index) => {
    let loaiNhanVien1 = nhanVien.loaiNhanVien();
    let convertLoaiNhanVien = removeVietnameseTones(
      loaiNhanVien1.toLowerCase()
    );
    console.log(convertLoaiNhanVien);
    return convertLoaiNhanVien.includes(keyWord);
  });
  console.log(arrFilter);
  arrFilterLoaiNhanVien = arrFilter;
  renderListNhanVien(arrFilterLoaiNhanVien);
};
//Validate

//  Hàm kiểm tra dữ liệu nhân viên

// function validateNhanVien(nhanVien) {
//   let isValid = true;

//   // Validate tài khoản (chỉ cho phép chữ + số, VD: SE182522)
//   let tknvPattern = /^[A-Za-z0-9]+$/;
//   if (!nhanVien.tknv || !tknvPattern.test(nhanVien.tknv)) {
//     document.getElementById("tbTKNV").innerText =
//       "Tài khoản chỉ chứa chữ + số (VD: SE182522)!";
//     alert("Tài khoản chỉ chứa chữ + số (VD: SE182522)!");
//     isValid = false;
//   } else {
//     document.getElementById("tbTKNV").innerText = "";
//   }

//   // Validate họ tên (phải là chữ)
//   let namePattern = /^[A-Za-zÀ-ỹ\s]+$/;
//   if (!nhanVien.name || !namePattern.test(nhanVien.name)) {
//     document.getElementById("tbTen").innerText = "Tên chỉ được chứa chữ!";
//     alert("Tên chỉ được chứa chữ!");
//     isValid = false;
//   } else {
//     document.getElementById("tbTen").innerText = "";
//   }

//   // Validate email
//   let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   if (!nhanVien.email || !emailPattern.test(nhanVien.email)) {
//     document.getElementById("tbEmail").innerText = "Email không hợp lệ!";
//     alert("Email không hợp lệ!");
//     isValid = false;
//   } else {
//     document.getElementById("tbEmail").innerText = "";
//   }
//   // Validate mật khẩu (6 - 10 ký tự, ít nhất 1 số, 1 chữ in hoa, 1 ký tự đặc biệt)
//   let passwordPattern =
//     /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
//   if (!nhanVien.password || !passwordPattern.test(nhanVien.password)) {
//     document.getElementById("tbMatKhau").innerText =
//       "Mật khẩu 6 - 10 ký tự, ít nhất 1 số, 1 chữ hoa, 1 ký tự đặc biệt!";
//     alert("Mật khẩu 6 - 10 ký tự, ít nhất 1 số, 1 chữ hoa, 1 ký tự đặc biệt!");
//     isValid = false;
//   } else {
//     document.getElementById("tbMatKhau").innerText = "";
//   }

//   // Validate ngày làm (định dạng mm/dd/yyyy)
//   // let datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
//   // if (!nhanVien.ngayLam || !datePattern.test(nhanVien.ngayLam)) {
//   //   document.getElementById("tbNgay").innerText =
//   //     "Ngày làm phải có định dạng mm/dd/yyyy!";
//   //   isValid = false;
//   // } else {
//   //   document.getElementById("tbNgay").innerText = "";
//   // }

//   // Validate lương cơ bản (1.000.000 - 20.000.000)
//   // let luongCB = parseFloat(nhanVien.luongCB);
//   // if (!luongCB || luongCB < 1000000 || luongCB > 20000000) {
//   //   document.getElementById("tbLuongCB").innerText =
//   //     "Lương cơ bản phải từ 1.000.000 - 20.000.000!";
//   //   isValid = false;
//   // } else {
//   //   document.getElementById("tbLuongCB").innerText = "";
//   // }

//   // Validate chức vụ (chỉ chấp nhận Sếp, Trưởng phòng, Nhân viên)
//   let validPositions = ["Sếp", "Trưởng phòng", "Nhân viên"];
//   if (!validPositions.includes(nhanVien.chucvu)) {
//     document.getElementById("tbChucVu").innerText =
//       "Chức vụ phải là Sếp, Trưởng phòng, Nhân viên!";
//     alert("Vui lòng chọn chức vụ");
//     isValid = false;
//   } else {
//     document.getElementById("tbChucVu").innerText = "";
//   }

//   // Validate số giờ làm (80 - 200 giờ)
//   let gioLam = parseInt(nhanVien.gioLam);
//   if (!gioLam || gioLam < 80 || gioLam > 200) {
//     document.getElementById("tbGiolam").innerText =
//       "Giờ làm phải từ 80 - 200 giờ!";
//     alert("Giờ làm phải từ 80 - 200 giờ!");
//     isValid = false;
//   } else {
//     document.getElementById("tbGiolam").innerText = "";
//   }

//   return isValid;
// }
