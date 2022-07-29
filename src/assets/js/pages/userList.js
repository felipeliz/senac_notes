var userList = (function () {
    'use strict';
    var userList = {};

    userList.init = function () {
        userList.validateForm();

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        $('.loading').css('display', 'block')
        userList.get();
    };

    userList.initEvents = function () {
        $('.btnSearchuser').on('click', userList.search);
        $('.btnClearuser').on('click', userList.clearForm);
        
        var rows = ''
        var profile = localStorage.getItem('profile')
        if (profile == 'Admin') {
            rows += '<a href="/user/create" class="btn btn-lg btn-primary float-right">Novo Usuário</a>'
            $('#buttonUser').html(rows);
        }

        userList.setMask();
    };

    userList.setMask = function () {
        
    }

    userList.validateForm = function () {

    };

    userList.getFormData = function () {
        let data = {
            name: $('#input_name').val(),
            taxNumber: $('#input_taxNumber').val(),
            bankAccount: $('#input_account').val(),


        }
        return data;
    }

    userList.logout = function () {
        localStorage.clear()
        location.href = '/'
    }

    userList.cancel = function () {
        location.href = '/user';
    }

    userList.clearForm = function () {
        document.getElementById('input_name').value = '';
        document.getElementById('input_taxNumber').value = '';
        document.getElementById('input_account').value = '';
        document.getElementById('select_status').value = '';
        $('.loading').css('display', 'block')
        userList.get();
    }

    userList.get = function () {

        let data = userList.getFormData();
        $.ajax({
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader('Content-Type', 'application/json');
                xhrObj.setRequestHeader('Accept', 'application/json');
                xhrObj.setRequestHeader('x-access-token', localStorage.getItem('token'));
            },
            method: 'POST',
            url: `${BASE_URL}/api/v0/person/list/1`,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
            .done(function (data) {
                console.log(data)
                $('.loading').css('display', 'none')
                let rows = "";
                for (let i = 0; i < data.elements.length; i++) {
                    let money = parseInt(data.elements[i].account[0].balance.balance)
                    let brl = money.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                    var bankAccount = ''
                    if(data.elements[i].account[0].bankAccount == 'null' || data.elements[i].account[0].bankAccount == null){
                        bankAccount = ''
                    }else {
                        bankAccount = data.elements[i].account[0].bankAccount
                    }
                    var status = ''
                    if(data.elements[i].account[0].status == 0){
                        var status =  '    <td><span class="badge badge-secondary">Pendente</span></td>';
                    } else if (data.elements[i].account[0].status == 1){
                        var status =  '    <td><span class="badge badge-warning">Em análise</span></td>';
                    } else if (data.elements[i].account[0].status == 2){
                        var status =  '    <td><span class="badge badge-dark">Rejeitado</span></td>';
                    } else if (data.elements[i].account[0].status == 3){
                        var status =  '    <td><span class="badge badge-danger">Bloqueado</span></td>';
                    } else if (data.elements[i].account[0].status == 4){
                        var status =  '    <td><span class="badge badge-success">Ativo</span></td>';
                    } else {
                        var status =  '    <td><span class="badge badge-light">Conferir</span></td>';
                    }
                    rows += '<tr>';
                    rows += '    <td>';
                    rows += data.elements[i].name;
                    rows += '    </td>';
                    rows += '    <td>';
                    rows += bankAccount;
                    rows += '    </td>';
                    rows += '    <td>';
                    rows += data.elements[i].taxNumber;
                    rows += '    </td>';
                    rows += '    <td>';
                    rows += brl;
                    rows += '    </td>';
                    rows += status;
                    rows += '    <td class="text-right">';
                    rows += '        <div class="btn-group">';
                    rows += ' <a href="/user/edit?id=' + data.elements[i].id + '" class="btn-white btn btn-xs"><i class="fa fa-edit"></i> Editar</a>';
                    rows += '        </div>';
                    rows += '    </td>';
                    rows += '</tr>';
                }

                $('#table_user').html(rows);

                $('.btnBlock').on('click', userList.Block);
            })
            .fail(function (err) {
                //console.log(err);
                toastr.error('Falha ao listar usuários!');
                return false;
            });
    }

    userList.search = function () {
        $('.loading').css('display', 'block')
        
        let data = userList.getFormData();

        $.ajax({
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader('Content-Type', 'application/json');
                xhrObj.setRequestHeader('Accept', 'application/json');
                xhrObj.setRequestHeader('x-access-token', localStorage.getItem('token'));
            },
            method: 'POST',
            url: `${BASE_URL}/api/v0/person/list/1`,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
            .done(function (data) {
                $('.loading').css('display', 'none')
                let rows = "";
                for (let i = 0; i < data.elements.length; i++) {
                    let money = parseInt(data.elements[i].account[0].balance.balance)
                    let brl = money.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                    var bankAccount = ''
                    if(data.elements[i].account[0].bankAccount == 'null' || data.elements[i].account[0].bankAccount == null){
                        bankAccount = ''
                    }else {
                        bankAccount = data.elements[i].account[0].bankAccount
                    }
                    var status = ''
                    if(data.elements[i].account[0].status == 0){
                        var status =  '    <td><span class="badge badge-secondary">Pendente</span></td>';
                    } else if (data.elements[i].account[0].status == 1){
                        var status =  '    <td><span class="badge badge-warning">Em análise</span></td>';
                    } else if (data.elements[i].account[0].status == 2){
                        var status =  '    <td><span class="badge badge-dark">Rejeitado</span></td>';
                    } else if (data.elements[i].account[0].status == 3){
                        var status =  '    <td><span class="badge badge-danger">Bloqueado</span></td>';
                    } else if (data.elements[i].account[0].status == 4){
                        var status =  '    <td><span class="badge badge-success">Ativo</span></td>';
                    } else {
                        var status =  '    <td><span class="badge badge-light">Conferir</span></td>';
                    }
                    rows += '<tr>';
                    rows += '    <td>';
                    rows += data.elements[i].name;
                    rows += '    </td>';
                    rows += '    <td>';
                    rows += bankAccount;
                    rows += '    </td>';
                    rows += '    <td>';
                    rows += data.elements[i].taxNumber;
                    rows += '    </td>';
                    rows += '    <td>';
                    rows += brl;
                    rows += '    </td>';
                    rows += status;
                    rows += '    <td class="text-right">';
                    rows += '        <div class="btn-group">';
                    rows += ' <a href="/user/edit?id=' + data.elements[i].id + '" class="btn-white btn btn-xs"><i class="fa fa-edit"></i> Editar</a>';
                    rows += '        </div>';
                    rows += '    </td>';
                    rows += '</tr>';
                }

                $('#table_user').html(rows);

                $('.btnBlock').on('click', userList.Block);
            })
            .fail(function (err) {
                //console.log(err);
                toastr.error('Falha ao listar usuários!');
                return false;
            });
    }

    userList.Block = function () {
        var id = $(this).attr('data-id');
        $.ajax({
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader('Content-Type', 'application/json');
                xhrObj.setRequestHeader('Accept', 'application/json');
                xhrObj.setRequestHeader('x-access-token', localStorage.getItem('token'));
            },
            method: 'GET',
            url: `${BASE_URL}/api/v0/account/show/${id}`,
            data: JSON.stringify(),
            contentType: 'application/json'
        })
            .done(function (data) {
                var status = ''
                if (data.data.status == '1') {
                    status = 0
                }
                if (data.data.status == '0') {
                    status = 1
                }
                $.ajax({
                    beforeSend: function (xhrObj) {
                        xhrObj.setRequestHeader('Content-Type', 'application/json');
                        xhrObj.setRequestHeader('Accept', 'application/json');
                        xhrObj.setRequestHeader('x-access-token', localStorage.getItem('token'));
                    },
                    method: 'PATCH',
                    url: `${BASE_URL}/api/v0/account/update/${id}`,
                    data: JSON.stringify({ status: status }),
                    contentType: 'application/json'
                }).done(function (data) {
                    toastr.success('Usuário deletado!')
                    userList.search()
                })
                    .fail(function (err) {
                        toastr.error('Falha ao deletar Usuário!');
                        return false;
                    });
            })
            .fail(function (err) {
                toastr.error('Falha ao deletar Usuário!');
                return false;
            });
    }

    return userList;
})();

userList.init();
userList.initEvents();