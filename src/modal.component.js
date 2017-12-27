window.modalComponent = Vue.extend({
    template: `
     <div :id="modal.id" class="modal">
        <div class="modal-content">
            <slot name="content"></slot>
        </div>
        <div class="modal-footer">
            <slot name="footer"></slot>
        </div>
     </div>
   `,
    props: ['modal'],
    data: function () {
        return {
            modal:{
                id: ''
            }        
        }
    },
});