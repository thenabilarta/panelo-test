const template = (id, nama) => {
  const div = $(`<div id=${id}>`);

  div.html(nama);

  return div;
};

// $('button#add[type="submit"]').click(function () {
//   event.preventDefault();

// const nama = $('input[name="nama"]').val();
// const harga = $('input[name="harga"]').val();

// var other_data = $('form').serializeArray();
// $.each(other_data, function (key, input) {
//   fd.append(input.name, input.value);
// });

// const files = $('input[name="gambar"]').get(0).files;
// // console.log(files);
// const formData = new FormData();
// formData.append('files', files);
// $.each(other_data, function (key, input) {
//   formData.append(input.name, input.value);
// });
// formData.append('nama', nama);
// formData.append('harga', harga);
// for (var pair of formData.entries()) {
//   console.log(pair[0] + ', ' + pair[1] + +', ' + pair[2]);
// }

// $.ajax({
//   url: '/add',
//   method: 'POST',
//   processData: false,
//   contentType: false,
//   dataType: 'json',
//   data: formData,
// });
// .then(location.reload());
// });

$('.fetch').click(function (event) {
  event.preventDefault();
  $.ajax({
    url: '/api/product',
    type: 'get',
    success: function (res) {
      console.log(res);
    },
  }).then((res) => location.reload());
});

const removeBurgerDelete = (burger) => {
  const id = burger.id;

  $(`#${id}`).remove();
};

$('.hapus').click(function () {
  event.preventDefault();
  const id = $(this).attr('id');
  swal('Are you sure you want to do this?', {
    buttons: ['Oh no!', true],
  }).then(() => {
    $.ajax({
      url: '/delete/' + id,
      method: 'DELETE',
    })
      .then(removeBurgerDelete)
      .then((res) => location.reload());
  });
});

$('.edit').click(function () {
  event.preventDefault();
  const id = $(this).attr('id');

  console.log(id);
  window.location.href = `/edit/${id}`;
});

$('.kembali').click(function () {
  event.preventDefault();
  window.location.href = '/';
});

$('button#edit[type="submit"]').click(function () {
  event.preventDefault();

  const nama = $('input[name="nama"]').val();
  const harga = $('input[name="harga"]').val();
  const gambar = $('input[name="gambar"]').val();

  const id = location.pathname.split('/');
  const paramsID = id.slice(-1)[0];

  console.log(paramsID);
  $.ajax({
    url: '/api/edit',
    method: 'PUT',
    data: {
      id: paramsID,
      nama: nama,
      harga: harga,
      gambar: gambar,
    },
  }).then(() => (window.location.href = '/'));
});
