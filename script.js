// مصفوفة تخزن بيانات الطلاب
const students = [];

const form = document.getElementById('studentForm');
const msg = document.getElementById('msg');

// عرض رسالة للمستخدم
function showMsg(text, type) {
  msg.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}

// عند الضغط على زر إضافة
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('studentId').value.trim();
  const avg = parseFloat(document.getElementById('average').value);

  if (id === '' || isNaN(avg)) {
    showMsg('من فضلك أدخل بيانات صحيحة.', 'danger');
    return;
  }
  if (avg < 0 || avg > 100) {
    showMsg('المتوسط يجب أن يكون بين 0 و 100.', 'danger');
    return;
  }
  if (students.some(s => s.id === id)) {
    showMsg('رقم الطالب موجود بالفعل.', 'warning');
    return;
  }

  students.push({ id, avg });
  showMsg('تمت إضافة الطالب بنجاح.', 'success');
  form.reset();
  render();
});

// حذف طالب
function removeStudent(index) {
  students.splice(index, 1);
  render();
}

// رسم الجدولين
function render() {
  // الجدول الأول: كل الطلاب
  const body = document.getElementById('studentsBody');
  body.innerHTML = students.length
    ? students.map((s, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${s.id}</td>
          <td>${s.avg}</td>
          <td><button class="btn btn-delete" onclick="removeStudent(${i})">حذف</button></td>
        </tr>`).join('')
    : '<tr><td colspan="4" class="empty">لا توجد بيانات بعد</td></tr>';

  // الجدول الثاني: المتعثرون (من 40 إلى 49)
  const struggling = students.filter(s => s.avg >= 40 && s.avg <= 49);
  const sBody = document.getElementById('strugglingBody');
  sBody.innerHTML = struggling.length
    ? struggling.map(s => {
        const raw = s.avg + 5;            // بعد إضافة 5 درجات
        const final = Math.min(raw, 50);  // لا يتجاوز 50
        const capped = raw > 50
          ? ' <span class="capped">(تم الوصول للحد الأقصى 50)</span>'
          : '';
        return `<tr class="row-warning">
          <td>${s.id}</td>
          <td>${s.avg}</td>
          <td>+5</td>
          <td class="final-grade">${final}${capped}</td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="4" class="empty">لا يوجد طلاب متعثرون</td></tr>';
}
