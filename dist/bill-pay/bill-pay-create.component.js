'use strict';

var names = ['Luz', 'Água', 'Telefone', 'Supermercado', 'Cartão de crédito', 'Empréstimo', 'Gasolina'];

window.billPayCreateComponent = Vue.extend({

    template: '\n    <div class="container">\n       <div class="row"> \n           <h4>Nova Conta</h4>\n        \n            <form name="form">\n\n                <div class="row">\n                    <div class="input-field col s6"> \n                        <label class="active">Vencimento</label>\n                        <input type="text" v-model="bill.date_due | dateFormat" placeholder="Informe a data">\n                    </div>\n\n                    <div class="input-field col s6"> \n                        <label class="active">Valor</label>\n                        <input type="text" v-model="bill.value | numberFormat">\n                    </div>\n\n                </div>\n\n                <div class="row">\n                    \n                    <label>Nome</label>\n\n                    <select id="select" v-model="bill.name" class="browser-default">\n                        <option value="" disabled selected>Escolha um nome</option>\n                        <option v-for="o in names" value="{{o}}">{{o}}</option>\n                    </select>\n                   \n                </div>\n\n                <div class="row"> \n                    <div class="input-field col s12">\n                        <input class="btn btn-large waves-effect right" type="button" value="Enviar" v-on:click="submit($event)">\n                    </div>\n                </div>        \n                \n                  \n            </form>\n        </div>\n    </div>         \n   ',
    data: function data() {
        return {
            formType: 'insert',
            names: names,
            bill: new BillPay()

        };
    },
    created: function created() {

        if (this.$route.name == 'bill-pay.update') {
            this.formType = 'update';
            this.getBill(this.$route.params.id);
            return;
        }

        //this.formType = 'insert';

        $(document).ready(function () {
            $('#select').material_select();
        });
    },

    methods: {
        submit: function submit(e) {
            var _this = this;

            e.preventDefault();

            var data = this.bill.toJSON();

            if (this.formType == 'insert') {

                Bill.save({}, data).then(function (response) {
                    _this.$dispatch('change-info');
                    _this.$router.go({ name: 'bill-pay.list' });
                    Materialize.toast('Conta criada com sucesso!', 4000, 'rounded');
                });
            } else {

                Bill.update({ id: this.bill.id }, data).then(function (response) {
                    _this.$dispatch('change-info');
                    _this.$router.go({ name: 'bill-pay.list' });
                    Materialize.toast('Conta atualizada com sucesso!', 4000, 'rounded');
                });
            }
        },
        getBill: function getBill(id) {
            var _this2 = this;

            Bill.get({ id: id }).then(function (response) {

                _this2.bill = new BillPay(response.json());
            });
        },
        getDateDue: function getDateDue(date_due) {
            var dateDueObject = date_due;
            if (!(date_due instanceof Date)) {
                dateDueObject = new Date(date_due.split('/').reverse().join('-') + "T03:00:00");
            }

            return dateDueObject.toISOString().split('T')[0];
        }
    }

});