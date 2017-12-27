window.billPayListComponent = Vue.extend({
    components: {
        'modal' : modalComponent
    },
    template: `
        <div class="container">
            <div class="row">

            <h4 class="grey-text lighten-1">Minhas contas a pagar</h4>

            <table class="bordered striped highlight centered responsive-table z-depth-5">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Data de vencimento</th>
                            <th>Nome</th>
                            <th>Valor</th>
                            <th>Paga?</th>
                            <th>Ações</th>
                            <th>Pagar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(index,bill) in bills">
                            <td>{{bill.id}}</td>
                            <td>{{bill.date_due | dateFormat}}</td>
                            <td>{{bill.name}}</td>
                            <td>{{bill.value | numberFormat}}</td>
                            <td :class="{'green-text' : bill.done, 'red-text' : !bill.done}">
                                {{bill.done | status}}
                            </td>
                            <td>
                                <a v-link="{name: 'bill-pay.update', params: {id:bill.id}}">Editar</a>                                                                                                                                                                                                                                                                                                      
                                |
                                <a href="#" @click.prevent="openModalDelete(bill)">Deletar</a>
                            </td>
                            <td>
                                <input id="checkbox_{{bill.id}}" type="checkbox" v-model="bill.done" @change="updatePay($event,bill)" />
                                <label for="checkbox_{{bill.id}}"></label>
                            </td>
                        </tr>
                    </tbody>
            </table>
            </div>
        </div>
        <modal :modal="modal">
            <div slot="content">
                <h4>Mensagem de confirmação</h4>
                <p><strong>Deseja excluir esta conta</strong></p>
            
                <div class="divider"></div>
                <p>Nome: <strong>{{billToDelete.name}}</strong></p>
                <p>Valor: <strong>{{billToDelete.value | numberFormat}}</strong></p>
                <p>Vencimento: <strong>{{billToDelete.date_due | dateFormat}}</strong></p>
                <div class="divider"></div>
            </div>
            <div slot="footer">
                <button class="btn btn-flat waves-effect waves-red modal-close modal-action">CANCELAR</button>
                <button @click="remove($event)" class="btn btn-flat waves-effect green lighten-2 modal-close modal-action">
                OK
                </button>
            </div>
        </modal>
    `,
    data() {
        return{
            bills: {},
            billToDelete: null,
            modal: {
                id: 'modal-delete'
            }
        }
    },
    created() {

        Bill.query().then((response) => {
            this.bills = response.json();
        });

        $(document).ready(function(){
            // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
            $('#modal1').modal();
        });

    },
    methods:{

        remove(e) {

            e.preventDefault();

            Bill.delete({id : this.billToDelete.id}).then((response) =>{

                this.bills.$remove(this.billToDelete);
                this.billToDelete = null; 
                Materialize.toast('Conta removida com sucesso!', 4000, 'rounded')
                this.$dispatch('change-info');   

            });

            

        },
        updatePay(e, bill){

            e.preventDefault();

            Bill.update({id : bill.id}, bill).then((response) => {
                
                this.$dispatch('change-info'); 

            });        

        },
        openModalDelete(bill){

            this.billToDelete = bill;

            $('#modal-delete').modal();
            $('#modal-delete').modal('open'); 
        }
    },

});