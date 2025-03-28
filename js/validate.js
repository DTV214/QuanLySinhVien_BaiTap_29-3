export function validateNhanVien(nhanVien) {
  let isValid = true;

  // Validate tài khoản (chỉ cho phép chữ + số, VD: SE182522)
  let tknvPattern = /^[A-Za-z0-9]+$/;
  if (!nhanVien.tknv || !tknvPattern.test(nhanVien.tknv)) {
    document.getElementById("tbTKNV").innerText =
      "Tài khoản chỉ chứa chữ + số (VD: SE182522)!";
    alert("Tài khoản chỉ chứa chữ + số (VD: SE182522)!");
    isValid = false;
  } else {
    document.getElementById("tbTKNV").innerText = "";
  }

  // Validate họ tên (phải là chữ)
  let namePattern = /^[A-Za-zÀ-ỹ\s]+$/;
  if (!nhanVien.name || !namePattern.test(nhanVien.name)) {
    document.getElementById("tbTen").innerText = "Tên chỉ được chứa chữ!";
    alert("Tên chỉ được chứa chữ!");
    isValid = false;
  } else {
    document.getElementById("tbTen").innerText = "";
  }

  // Validate email
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!nhanVien.email || !emailPattern.test(nhanVien.email)) {
    document.getElementById("tbEmail").innerText = "Email không hợp lệ!";
    alert("Email không hợp lệ!");
    isValid = false;
  } else {
    document.getElementById("tbEmail").innerText = "";
  }
  // Validate mật khẩu (6 - 10 ký tự, ít nhất 1 số, 1 chữ in hoa, 1 ký tự đặc biệt)
  let passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
  if (!nhanVien.password || !passwordPattern.test(nhanVien.password)) {
    document.getElementById("tbMatKhau").innerText =
      "Mật khẩu 6 - 10 ký tự, ít nhất 1 số, 1 chữ hoa, 1 ký tự đặc biệt!";
    alert("Mật khẩu 6 - 10 ký tự, ít nhất 1 số, 1 chữ hoa, 1 ký tự đặc biệt!");
    isValid = false;
  } else {
    document.getElementById("tbMatKhau").innerText = "";
  }

  // Validate ngày làm (định dạng mm/dd/yyyy)
  // let datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  // if (!nhanVien.ngayLam || !datePattern.test(nhanVien.ngayLam)) {
  //   document.getElementById("tbNgay").innerText =
  //     "Ngày làm phải có định dạng mm/dd/yyyy!";
  //   isValid = false;
  // } else {
  //   document.getElementById("tbNgay").innerText = "";
  // }

  // Validate lương cơ bản (1.000.000 - 20.000.000)
  // let luongCB = parseFloat(nhanVien.luongCB);
  // if (!luongCB || luongCB < 1000000 || luongCB > 20000000) {
  //   document.getElementById("tbLuongCB").innerText =
  //     "Lương cơ bản phải từ 1.000.000 - 20.000.000!";
  //   isValid = false;
  // } else {
  //   document.getElementById("tbLuongCB").innerText = "";
  // }

  // Validate chức vụ (chỉ chấp nhận Sếp, Trưởng phòng, Nhân viên)
  let validPositions = ["Sếp", "Trưởng phòng", "Nhân viên"];
  if (!validPositions.includes(nhanVien.chucvu)) {
    document.getElementById("tbChucVu").innerText =
      "Chức vụ phải là Sếp, Trưởng phòng, Nhân viên!";
    alert("Vui lòng chọn chức vụ");
    isValid = false;
  } else {
    document.getElementById("tbChucVu").innerText = "";
  }

  // Validate số giờ làm (80 - 200 giờ)
  let gioLam = parseInt(nhanVien.gioLam);
  if (!gioLam || gioLam < 80 || gioLam > 200) {
    document.getElementById("tbGiolam").innerText =
      "Giờ làm phải từ 80 - 200 giờ!";
    alert("Giờ làm phải từ 80 - 200 giờ!");
    isValid = false;
  } else {
    document.getElementById("tbGiolam").innerText = "";
  }

  return isValid;
}
