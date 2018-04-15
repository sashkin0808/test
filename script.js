$(function() {
    var buttons = $('#buttins_template').html(); // html код кнопок
    var currentEditedRow;

    function CreateTable(list) {
        for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            var phone = list[i].phone;
            var email = list[i].email;
            var w = "<tr><td><div class=\"data\">" + name + "</div></td><td><div class=\"data\">" + phone + "</div></td><td><div class=\"data\">" + email + "</div></td>" + buttons + "</tr>";
            $(w).appendTo($('tbody'));
        };
        $('.data').attr('contenteditable', true);
        $('.content').css('display', 'block'); // показываем блок с контентом 
        $('.transition-loader').fadeOut(); // и скрываем сам блок прелоудера.
    }

    api.contactsGetAll(CreateTable);

    $('form.new').submit(function() {
        var data = $(this).serializeArray();
        var name = data[0].value;
        var phone = data[1].value;
        var email = data[2].value;
        var row = {
            name: name,
            phone: phone,
            email: email
        };
        // блокируем инпуты и кнопки на время добавления
        $('thead').find('input').attr('disabled', 'true'); 
        $('thead').find('button').attr('disabled', 'true');

        api.contactsAdd(row, function() {
            var newRow = "<tr><td><div class=\"data\">" + name + "</div></td><td><div class=\"data\">" + phone + "</div></td><td><div class=\"data\">" + email + "</div></td>" + buttons + "</tr>";
            $(newRow).appendTo($('tbody'));
            $('.data').attr("contenteditable", true);
            $('thead').find('input').val("");
            $('thead').find('input').removeAttr('disabled', 'true');
            $('thead').find('button').removeAttr('disabled', 'true');
        });

        return false;
    });

    $('table').on('click', '.delete', function() {
        var pos = $(this).parents('tr').prevUntil('tbody').length;
        $(this).attr('disabled', 'true');
        var deleteButton = $(this);
        api.contactsRemove(pos, function() {
            deleteButton.closest('tr').remove();
            deleteButton.removeAttr('disabled');
        });
    });

    $('table').on('keyup', '.data', function() {
        currentRow = $(this).parents('tr');
        currentRow.children('.buttons').children('.save').fadeIn();
        $('.save').click(function() {
            var currentName = currentRow.children(':first-child').text();
            var currentPhone = currentRow.children(':nth-child(2)').text();
            var currentEmail = currentRow.children(':nth-child(3)').text();
            var row = {
                name: currentName,
                phone: currentPhone,
                email: currentEmail
            };
            var pos = currentRow.prevUntil('tbody').length;
            $(this).text("Сохранение...");
            var button = $(this);

            api.contactsEdit(pos, row, function() {
                button.fadeOut(function() {
                    button.text("Сохранить");
                });
            });
        });
        return false;
    });

    function Search() {
        var word = $('#search').val().toLowerCase();
        var view = false;

        $.each($('tbody tr'), function() {
            if ($(this).find('td:first-child').text().toLowerCase().indexOf(word) === -1) {
                $(this).hide();
            } else {
                $(this).show();
                view = true;
            }
        });

        if ($('#search').val()) {
            $('.show').removeAttr('disabled');
        } else {
            $('.show').attr('disabled', true);
        }

        if (view || !$('#search').val()) {
            $('table').removeClass('visually-hidden');
        } else {
            $('table').addClass('visually-hidden');
        };
        return false;
    };

    $('#search').keyup(Search);
    $('.search').submit(Search);

    $('.show').click(function() {
        $('#search').val('');
        $('.search').submit();
        $(this).attr('disabled', true);
    });
});