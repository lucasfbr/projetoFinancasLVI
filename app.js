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

           this.$parent.activedView = id;
           if (id == 1) {
               this.$parent.formType = 'insert';
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

            this.$parent.bill = bill;
            this.$parent.activedView = 1;
            this.$parent.formType = 'update';
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
   props:['bill', 'formType'],
   data: function () {
       return {
           names: [
               'Luz',
               'Água',
               'Telefone',
               'Supermercado',
               'Cartão de crédito',
               'Empréstimo',
               'Gasolina',
           ],
       }
   },
   methods:{
       submit: function (e) {

           e.preventDefault();

           if (this.formType == 'insert') {
               this.$parent.$children[1].bills.push(this.bill);
           }

           this.bill = {
               date_due: '',
               name: '',
               value: 0,
               done: false,
           }

           this.$parent.activedView = 0;
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
         <bill-list-component></bill-list-component>
    </div>
    
    <div v-show="activedView == 1">
        <bill-create-component :bill.sync="bill" :form-type="formType"></bill-create-component>
    </div>
    `,
    data: function() {
        return {
            title: 'Contas a pagar',
            statusCliente: '',
            formType: 'insert',
            activedView: 0,
            bill: {
                date_due: '',
                name: '',
                value: 0,
                done: false,
            },

        }
    },
    computed: {
                status: function () {

                    var count = 0;

                    if (!this.bills.length)
                        return false;

                    for (var i in this.bills) {
                        if (!this.bills[i].done) {
                            count++;
                        }
                    }

                    return count;

                }
    },
    methods: {


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




