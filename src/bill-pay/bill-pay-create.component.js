const names = [
            'Luz',
            'Água',
            'Telefone',
            'Supermercado',
            'Cartão de crédito',
            'Empréstimo',
            'Gasolina',
        ];

window.billPayCreateComponent = Vue.extend({

    template: `
    <div class="container">
       <div class="row"> 
           <h4>Nova Conta</h4>
        
            <form name="form">

                <div class="row">
                    <div class="input-field col s6"> 
                        <label class="active">Vencimento</label>
                        <input type="text" v-model="bill.date_due | dateFormat" placeholder="Informe a data">
                    </div>

                    <div class="input-field col s6"> 
                        <label class="active">Valor</label>
                        <input type="text" v-model="bill.value | numberFormat">
                    </div>

                </div>

                <div class="row">
                    
                    <label>Nome</label>

                    <select id="select" v-model="bill.name" class="browser-default">
                        <option value="" disabled selected>Escolha um nome</option>
                        <option v-for="o in names" value="{{o}}">{{o}}</option>
                    </select>
                   
                </div>

                <div class="row"> 
                    <div class="input-field col s12">
                        <input class="btn btn-large waves-effect right" type="button" value="Enviar" v-on:click="submit($event)">
                    </div>
                </div>        
                
                  
            </form>
        </div>
    </div>         
   `,
    data() {
        return {
            formType: 'insert',
            names: names,
            bill: new BillPay()

        }
    },
    created(){   

        if(this.$route.name == 'bill-pay.update'){
            this.formType = 'update';
            this.getBill(this.$route.params.id)
            return
        }

        //this.formType = 'insert';

        $(document).ready(function(){
            $('#select').material_select();
        });

    },
    methods:{
        submit(e) {

            e.preventDefault();

            var data = this.bill.toJSON();

            if (this.formType == 'insert') {

                Bill.save({}, data).then((response) => {
                    this.$dispatch('change-info');
                    this.$router.go({name: 'bill-pay.list'})
                    Materialize.toast('Conta criada com sucesso!', 4000, 'rounded')
                });

            }else{

                Bill.update({id : this.bill.id}, data).then((response) => {
                    this.$dispatch('change-info');
                    this.$router.go({name: 'bill-pay.list'})
                    Materialize.toast('Conta atualizada com sucesso!', 4000, 'rounded')
                });

            }

        },
        getBill(id) {

            Bill.get({id : id}).then((response) => {
                
                this.bill = new BillPay(response.json());

            });

        },
        getDateDue(date_due){
            let dateDueObject = date_due;
            if(!(date_due instanceof Date)){
                dateDueObject = new Date(date_due.split('/').reverse().join('-') + "T03:00:00"); 
            }

            return dateDueObject.toISOString().split('T')[0];
        }

    }

});