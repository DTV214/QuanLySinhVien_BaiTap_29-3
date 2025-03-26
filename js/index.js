const KEY_LOCAL = "arrNhanVien";
let arrNhanVien = getDataNhanVienLocal();
let arrFilterLoaiNhanVien = [];
renderListNhanVien();

function layDuLieuTuForm(form) {
  if (!(form instanceof HTMLFormElement)) {
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
  let arrField = document.querySelectorAll("#myModal input, #myModal select");
  let nhanVien = {};

  for (let field of arrField) {
    let { id, value } = field;
    nhanVien[id] = value;
  }

  // Chuyển đổi dữ liệu về kiểu số
  nhanVien.luongCB = parseFloat(nhanVien.luongCB) || 0;
  nhanVien.gioLam = parseInt(nhanVien.gioLam) || 0;

  assignMethods(nhanVien);

  arrNhanVien.push(nhanVien);
  saveDataNhanVien();
  renderListNhanVien();
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
