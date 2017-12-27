window.billComponent = Vue.extend({
    template: `
        <ul v-bind:id="o.id" class="dropdown-content" v-for="o in menuDropDown">
            <li v-for="item in o.items">
                <a v-link="{name: item.nameRouter}">{{item.name}}</a>
            </li>
        </ul>
        <nav class="teal lighten-2">
            <div class="nav-wrapper container">
                <a href="#" class="brand-logo">Code Contas</a>
                
                <a href="#" data-activates="nav-mobile" class="button-collapse">
                    <i class="material-icons">menu</i>
                </a>

                <ul class="right hide-on-med-and-down">
                    <li v-for="o in menus">
                        <a v-if="o.dropDownId" class="dropdown-button" href="!#" 
                        v-bind:data-activates="o.dropDownId" >
                            {{o.name}} <i class="material-icons right">arrow_drop_down</i>
                        </a>

                        <a v-else v-link="{name: o.nameRouter}" >
                            {{o.name}}
                        </a>
                    </li>
                </ul>

                <ul id="nav-mobile" class="side-nav">
                    <li v-for="o in menus">
                        <a v-link="{name: o.nameRouter}">{{o.name}}</a>
                    </li>
                </ul>

            </div>
        </nav>

    <router-view></router-view>
     
   `,
    created(){

        $(document).ready(function(){
            $(".button-collapse").sideNav();
            $(".dropdown-button").dropdown();
        });

    },
    data: function () {
        return {
            menus: [
                {name: 'Contas a pagar', nameRouter: 'bill-pay.list', dropDownId: 'bill-pay'},
                {name: 'Contas a receber', nameRouter: 'bill-receive', dropDownId: 'bill-receive'},
            ],
            menuDropDown: [
                {id: 'bill-pay', items: [

                {id: 0, name: 'Listar contas', nameRouter: 'bill-pay.list'},
                {id: 1, name: 'Criar contas', nameRouter: 'bill-pay.create'},

                ]},
                {id: 'bill-receive', items: [

                {id: 0, name: 'Listar contas', nameRouter: 'bill-pay.list'},
                {id: 1, name: 'Criar contas', nameRouter: 'bill-pay.create'},

                ]}
            ]
        }
    },
});