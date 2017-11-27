var menuComponent = Vue.extend({
   template: `
   <nav>
        <ul v-for="o in menus">
            <li><a href="#" v-on:click="showView($event,o.id)">{{o.name}}</a></li>
        </ul>
    </nav>
   `,
   data: function () {
       return {
           menus: [
               {id: 0, name: 'Listar contas'},
               {id: 1, name: 'Criar contas'},
           ],
       }
   },
   methods:{
       showView: function (e, id) {
           e.preventDefault();

           this.$dispatch('change-activedview', id);

           if (id == 1) {
               //this.$parent.formType = 'insert';
               this.$dispatch('change-formType', 'insert')
           }

       },
   }
});

var billListComponent = Vue.extend({

    template: `
        <style type="text/css">
        .pago{color:green}
        .pendente{color:red}
        </style>
        <table border="1" cellpadding="10">
                <theady>
                    <tr>
                        <th>#</th>
                        <th>Data de vencimento</th>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Paga?</th>
                        <td>Ações</td>
                        <td>Pagamento</td>
                    </tr>
                </theady>
                <tbody>
                    <tr v-for="(index,bill) in bills">
                        <td>{{index + 1}}</td>
                        <td>{{bill.date_due}}</td>
                        <td>{{bill.name}}</td>
                        <td>{{bill.value | currency 'R$ ' 2}}</td>
                        <td :class="{'pago' : bill.done, 'pendente' : !bill.done}">
                            {{bill.done | status}}
                        </td>
                        <td>
                            <a href="#" @click="loadBill($event,bill)">Editar</a>
                            |
                            <a href="#" @click="remove($event,bill)">Deletar</a>
                        </td>
                        <td>
                            <input type="checkbox" v-model="bill.done">
                        </td>
                    </tr>
                </tbody>
        </table>
    `,
    data: function () {
        return{
            bills: [
                {date_due: '20/08/2016', name: 'Luz', value: '25.99', done: true},
                {date_due: '21/08/2016', name: 'Água', value: '25.99', done: false},
                {date_due: '22/08/2016', name: 'Telefone', value: '25.99', done: false},
                {date_due: '23/08/2016', name: 'Supermercado', value: '25.99', done: false},
                {date_due: '24/08/2016', name: 'Cartão de crédito', value: '25.99', done: false},
                {date_due: '25/08/2016', name: 'Empréstimo', value: '25.99', done: false},
                {date_due: '26/08/2016', name: 'Gasolina', value: '25.99', done: false},
            ],
        }
    },
    methods:{

        loadBill: function (e, bill) {

            e.preventDefault();

            this.$dispatch('change-bill', bill);
            this.$dispatch('change-activedview', 1);
            this.$dispatch('change-formType', 'update')
        },
        remove: function (e, bill) {

            e.preventDefault();

            if (confirm('Você realmente deseja excluir este registro?')) {

                //$remove é uma classe nativa do vuejs para remover
                //dados de um array
                this.bills.$remove(bill);

            }

            this.$parent.activedView = 0;

        },
    },
    events: {
        "new-bill": function (bill) {
            this.bills.push(bill);
        }
    },
    filters: {
        status: function (value) {
            var status;
            if (value === false) {
                status = 'Não'
            } else {
                status = 'Sim'
            }
            return status;
        },
    }

});

var billCreateComponent = Vue.extend({

   template: `
       <h3>Formulário de cadastro</h3>
    
        <form name="form">
            <label>Vencimento</label>
            <input type="text" v-model="bill.date_due">
            <br><br>
            <label>Nome</label>
            <select v-model="bill.name">
                <option v-for="o in names" value="{{o}}">{{o}}</option>
            </select>
            <br><br>
            <label>Valor</label>
            <input type="text" v-model="bill.value">
            <br><br>
            <input type="button" value="Enviar" v-on:click="submit($event)">
        </form> 
   `,
   data: function () {
       return {
           formType: 'insert',
           names: [
               'Luz',
               'Água',
               'Telefone',
               'Supermercado',
               'Cartão de crédito',
               'Empréstimo',
               'Gasolina',
           ],
           bill: {
               date_due: '',
               name: '',
               value: 0,
               done: false,
           },

       }
   },
   methods:{
       submit: function (e) {

           e.preventDefault();

           if (this.formType == 'insert') {
               //this.$parent.$refs.billListComponent.bills.push(this.bill);
               this.$dispatch('new-bill', this.bill)
           }

           this.bill = {
               date_due: '',
               name: '',
               value: 0,
               done: false,
           }

           this.$dispatch('change-activedview', 0);
       },

   },
   events:{
       "change-formType": function (formType) {
           this.formType = formType;
       },
       "change-bill": function (bill) {
           this.bill = bill;
       },
   }

});

var appComponent = Vue.extend({
    components:{
        'menu-component': menuComponent,
        'bill-list-component': billListComponent,
        'bill-create-component': billCreateComponent
    },
    template: `
    <style type="text/css">
        .nenhumaPendente{color:green}
        .existemContas{color:red}
        .nenhumaConta{color:darkgray}
    </style>
    <h1>{{title}}</h1>

    <h3 :class="{'nenhumaConta' : statusCliente==0, 'nenhumaPendente' : statusCliente==1, 'existemContas' : statusCliente==2 }">
        {{status | statusCliente}}
    </h3>
    
    <menu-component></menu-component>
    
    <div v-show="activedView == 0">
         <bill-list-component v-ref:bill-list-component></bill-list-component>
    </div>
    
    <div v-show="activedView == 1">
        <bill-create-component :bill.sync="bill"></bill-create-component>
    </div>
    `,
    data: function() {
        return {
            title: 'Contas a pagar',
            statusCliente: '',
            activedView: 0,

        }
    },
    computed: {
                status: function () {


                    var billListComponent = this.$refs.billListComponent;

                    if (!billListComponent.bills.length) {
                        return false;
                    }

                    var count = 0;

                    for (var i in billListComponent.bills) {
                        if (!billListComponent.bills[i].done) {
                            count++;
                        }
                    }

                    return count;

                }
    },
    methods: {


    },
    events: {
        "change-activedview": function (activedView) {
            this.activedView = activedView;
        },
        "change-formType": function (formType) {
            this.$broadcast('change-formType', formType);
        },
        "change-bill": function (bill) {
            this.$broadcast('change-bill', bill);
        },
        "new-bill": function (bill) {
            this.$broadcast('new-bill', bill);
        }
    },
    filters: {
        statusCliente: function (value) {
            var status;

            if (value === false) {
                status = 'Nenhuma conta cadastrada';
                this.statusCliente = 0;
                console.log(this.statusCliente);
            }

            if (value === 0) {
                status = 'Nenhuma conta a pagar';
                this.statusCliente = 1;
                console.log(this.statusCliente);

            }

            if (value > 0) {
                status = 'Existem ' + value + ' contas a serem pagas';
                this.statusCliente = 2;
                console.log(this.statusCliente);
            }

            return status;
        }
    }
});

Vue.component('app-component', appComponent);


var app = new Vue({
    el:'#app',


});




