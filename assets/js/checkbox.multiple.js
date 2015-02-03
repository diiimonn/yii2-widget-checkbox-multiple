(function($){
    $.fn.checkboxMultiple = function(o) {
        var options = $.extend(true, {
            data: {},
            limit: null,
            defaultCheckbox: true,
            templateItem: '',
            templateCheckbox: '',
            templateResultItem: '',
            templateResultError: '',
            templateResultWarning: '',
            templatePlaceholder: '',
            templateInput: '',
            errorMessage: 'Error',
            warningMessage: 'Warning',
            wait: 2000,
            ajax: {
                url: '',
                type: 'POST',
                dataType: 'JSON'
            },
            slimScroll: {
                height: '100px',
                width: 'auto',
                alwaysVisible: true,
                railVisible: true,
                wheelStep: 10
            }
        }, o);
        
        return this.each(function(i, widget) {
            var wait = 0;

            var pvt = {
                setResults: function(r) {
                    var section = $('.checkbox-multiple-result', $(widget)),
                        tmp = 'templateResultItem';

                    section.html('');

                    if (!r || !$.isArray(r)) {
                        tmp = 'templateResultError';
                        r = [{"id":0, "text": options.errorMessage}];
                    } else if (!r.length) {
                        tmp = 'templateResultWarning';
                        r = [{"id":0, "text": options.warningMessage}];
                    }

                    for(var i=0;i<r.length;i++) {
                        var t = $(options[tmp].replace(/\{text\}/, r[i].text));
                        t.get(0).itemId = r[i].id;
                        t.get(0).itemText = r[i].text;
                        t.appendTo(section);

                        if (tmp == 'templateResultItem') {
                            t.on('click', function(e){
                                pub.addItem(this.itemId, this.itemText);
                                pub.hideSearch();
                                e.stopPropagation();
                            });
                        }
                    }

                    $(widget).removeClass('checkbox-multiple-searching').trigger('search-stop');
                },
                updatePosition: function() {
                    var searchSection = $('.checkbox-multiple-search', $(widget)),
                        bottom = ($(widget).offset().top + searchSection.height() + $(widget)['outerHeight']()) - $(window)['scrollTop']();

                    if ($(window).height() - bottom < 10) {
                        searchSection.css({
                            'padding-top': searchSection.css('padding-left'),
                            'padding-bottom': $(widget)['outerHeight'](),
                            'top': 'auto',
                            'bottom': '-1px'
                        });
                    } else {
                        searchSection.css({
                            'padding-bottom': searchSection.css('padding-left'),
                            'padding-top': $(widget)['outerHeight'](),
                            'top': '-1px',
                            'bottom': 'auto'
                        });
                    }
                },
                getItemsId: function() {
                    var itemsId = [];

                    var checkboxName = $(options.templateCheckbox).attr('name');
                    $('input[name="'+checkboxName+'"]').each(function(i, el){
                        itemsId[itemsId.length] = $(el).val();
                    });

                    return itemsId;
                },
                setPlaceholder: function() {
                    var itemsSection = $('.checkbox-multiple-items-section', $(widget)),
                        defaultCheckbox = $(options.templateCheckbox.replace(/\{id\}/, '')).addClass('checkbox-multiple-default');

                    if (!itemsSection['children']().length) {
                        var placeholder = $(options.templatePlaceholder);

                        placeholder.appendTo(itemsSection);

                        if (options.defaultCheckbox) {
                            defaultCheckbox.appendTo($('.checkbox-multiple-checkbox-section', $(widget)));
                        }
                    }
                },
                removePlaceholder: function() {
                    var placeholder = $('.checkbox-multiple-placeholder', $(widget)),
                        checkboxDefault = $('.checkbox-multiple-default', $(widget));

                    if (placeholder) {
                        placeholder.unbind().remove();
                    }

                    if (checkboxDefault.length) {
                        checkboxDefault.remove();
                    }
                }
            };

            var pub = {
                init: function() {
                    if ($.isPlainObject(options.data)) {
                        for(var i in options.data) {
                            if (options.data.hasOwnProperty(i)) {
                                pub.addItem(i, options.data[i]);
                            }
                        }
                    }

                    pvt.setPlaceholder();

                    $(document).on('click', function(e) {
                        if ($(e.target).closest($(widget)).length &&
                            ($(e.target).hasClass('checkbox-multiple-items-section') ||
                            $(e.target).closest('.checkbox-multiple-search').length ||
                                $(e.target).closest('.checkbox-multiple-placeholder').length)) {
                            if (!$('.checkbox-multiple-search', $(widget)).is(':visible')) {
                                pub.showSearch();
                            }
                        } else {
                            pub.hideSearch();
                        }
                    });

                    return true;
                },
                search: function(w) {
                    $(widget).trigger('search-start');
                    var data = typeof w == 'string' && w.length ? {search: w} : {};

                    data['itemsId'] = pvt.getItemsId();

                    $.ajax({
                        url: options.ajax.url,
                        type: options.ajax.type,
                        dataType: options.ajax.dataType,
                        data: data,
                        success: function(json) {
                            if (!json.error) {
                                pvt.setResults(json['results']);
                            } else {
                                pvt.setResults();
                            }
                        },
                        error: function() {
                            pvt.setResults();
                        }
                    });
                },
                showSearch: function() {
                    if (options.limit && $('.checkbox-multiple-items-section', $(widget))['children']().length >= options.limit) {
                        return false;
                    }

                    var input = $(options.templateInput);
                    input.appendTo($('.checkbox-multiple-input-section', $(widget)));

                    input.on('keyup', function() {
                        if (!wait) {
                            $(widget).addClass('checkbox-multiple-searching');
                        }

                        wait++;
                        setTimeout(function() {
                           wait--;

                            if (!wait) {
                                pub.search(input.val());
                            }
                        }, options.wait);
                    });

                    $(widget).unbind('search-stop').on('search-stop', function() {
                        $('.checkbox-multiple-search', $(widget)).show();
                        input.focus();

                        $('.checkbox-multiple-result', $(widget)).slimScroll(options.slimScroll);

                        pvt.updatePosition();
                        $(widget).addClass('checkbox-multiple-showing');
                    });

                    pub.search();

                    return true;
                },
                hideSearch: function() {
                    $('.checkbox-multiple-search', $(widget)).hide();
                    $('.checkbox-multiple-result', $(widget)).html('');
                    $('.checkbox-multiple-input-section > input', $(widget)).remove();
                    $(widget).removeClass('checkbox-multiple-showing');
                    window['isOverPanel'] = false;
                },
                addItem: function(id, name) {
                    var itemsSection = $('.checkbox-multiple-items-section', $(widget)),
                        item = $(options.templateItem.replace(/\{text\}/, name)),
                        checkbox = $(options.templateCheckbox.replace(/\{id\}/, id));

                    pvt.removePlaceholder();

                    item.appendTo(itemsSection);
                    item.get(0).itemId = id;

                    $('.checkbox-multiple-remove-item', item).on('click', function() {
                        pub.removeItem(id);
                    });

                    checkbox.appendTo($('.checkbox-multiple-checkbox-section', $(widget)));
                    checkbox.get(0).itemId = id;
                },
                removeItem: function(id) {
                    var itemsSection = $('.checkbox-multiple-items-section', $(widget));
                    itemsSection['children']().each(function(i, el){
                        if (el.itemId == id) {
                            $(el).unbind().remove();
                            return false;
                        }

                        return true;
                    });

                    $('.checkbox-multiple-checkbox-section', $(widget))['children']().each(function(i, el){
                        if (el.itemId == id) {
                            $(el).unbind().remove();
                            return false;
                        }

                        return true;
                    });

                    pvt.setPlaceholder();
                }
            };
            
            pub.init();
        });
    };
})(jQuery);