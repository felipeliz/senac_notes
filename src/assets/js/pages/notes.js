var note = (function () {
    'use strict';
    var note = {};

    note.init = function () {
        console.log('1. init')
        note.list();
        $('.btnSave').on('click', note.save);
    };

    note.initEvents = function () {
        console.log('2. initEvents')
        
        $('.btnEdit').on('click', note.show);
        $('.btnNew').on('click', note.clearFormData);
        //note.setMask();
    };

    note.getFormData = function () {
        console.log('9. getFormData')
        
        let formData = {};
        formData.id = $('#input_id').val();
        formData.userId = $('#input_user').val();
        formData.date = $('#input_date').val();
        formData.title = $('#input_title').val();
        formData.description = $('#input_description').val();
        formData.status = 0;

        return formData;
    };

    note.setFormData = function (data) {
        console.log('7. setFormData')
        console.log('7. data', data)
        
        $('#input_id').val(data.id);
        $('#input_user').val(data.userId);
        $('#input_date').val(data.date);
        $('#input_title').val(data.title);
        $('#input_description').val(data.description);
    };

    note.clearFormData = function (data) {
        console.log('8. setFormData')
        console.log('8. data', data)
        
        $('#input_id').val('');
        $('#input_user').val('');
        $('#input_date').val('');
        $('#input_title').val('');
        $('#input_description').val('');
    };

    note.list = function () {
        console.log('3. list')

        $.ajax({
            method: 'GET',
            url: `http://localhost:4000/notes/list`,
            contentType: 'application/json'
        })
            .done(function (data) {
                console.log('4. data ', data);

                let html;
                
                for (let i=0; i<data.data.length; i++) {
                    html+=`
                    <tr>
                        <td style="border: 1px solid; padding: 10px;">${data.data[i].date}</td>
                        <td style="border: 1px solid; padding: 10px;">${data.data[i].user.name}</td>
                        <td style="border: 1px solid; padding: 10px;">${data.data[i].title}</td>
                        <td style="border: 1px solid; padding: 10px;">
                            <button type="button" class="btn btn-primary btnEdit" note-id="${data.data[i].id}" data-toggle="modal" data-target="#exampleModal">
                            Editar
                        </button>
                        </td>
                    </tr>`;
                }
                console.log('5. table', html);
                $('#table-content').html(html);
                note.initEvents();
            })
            .fail(function (err) {
                console.log('5. error ', err);
                toastr.error('Falha ao listar notes!');
                return false;
            });
    }

    note.show = function (event) {
        let noteId = event.target.getAttribute('note-id');

        $.ajax({
            method: 'GET',
            url: `http://localhost:4000/notes/show/${noteId}`,
            contentType: 'application/json'
        })
            .done(function (data) {
                console.log('6. data ', data);
                note.setFormData(data.data);
            })
            .fail(function (err) {
                console.log('6. error ', err);
                toastr.error('Falha ao carregar note!');
                return false;
            });
    }

    note.save = function (event) {
        let data = note.getFormData();

        $.ajax({
            method: (data.id !== '' ? 'PATCH' : 'POST'),
            url: (data.id !== '' ? `http://localhost:4000/notes/update/${data.id}` : `http://localhost:4000/notes/store`),
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
            .done(function (data) {
                note.setFormData(data);
                $('#exampleModal').modal('hide');
                note.list()
            })
            .fail(function (err) {
                console.log('6. error ', err);
                toastr.error('Falha ao carregar note!');
                return false;
            });
    }
    
    return note;
})();

note.init();