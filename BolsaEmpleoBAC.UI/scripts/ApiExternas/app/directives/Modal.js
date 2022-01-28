'use strict';
(function () {
    angular
        .module('BacApp.directives.modal', [])
        .directive('modal', Directive);

    function Directive(ModalServices) {
        return {
            link: function (scope, element, attrs) {
                // ensure id attribute exists
                if (!attrs.id) {
                    console.error('modal must have an id');
                    return;
                }

                // move element to bottom of page (just before </body>) so it can be displayed above everything else
                element.appendTo('body');

                // close modal on background click
                element.on('click', function (e) {
                    var target = $(e.target);
                    if (!target.closest('.modal-body').length) {
                        scope.$evalAsync(Close);
                    }
                });

                // add self (this modal instance) to the modal service so it's accessible from controllers
                var modal = {
                    id: attrs.id,
                    open: Open,
                    close: Close
                };
                ModalServices.Add(modal);

                // remove self from modal service when directive is destroyed
                scope.$on('$destroy', function () {
                    ModalServices.Remove(attrs.id);
                    element.remove();
                });

                // open modal
                function Open() {
                    element.show();
                    $('body').addClass('modal-open');
                }

                // close modal
                function Close() {
                    element.hide();
                    $('body').removeClass('modal-open');
                }
            }
        };
    }
})();