<template>
    <PageHeader/>
    <div class="page-edit">
        <div class="page-edit-container">
            <div class="route">
                <router-view/>
            </div>            
            <div class="filter">
                <FilterProfileEdit />
            </div>
        </div>     
    </div>
</template>
  
<script>


import PageHeader from "@/components/PageHeader";
import FilterProfileEdit from "@/components/FilterProfileEdit";

export default {
    
    components: {
        PageHeader,
        FilterProfileEdit
    },
    
}
</script>
  
<style scoped>

    .page-edit{
        display: flex;
        margin: 0px 300px 20px 500px;
        padding: 0px 0px 20px 0px;
        
    }

    .page-edit-container{
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-evenly;
        margin-top: 90px;
    }

    .filter{
        min-width: 300px;
    }

    .route{
        width: 500px;
        margin-right: 20px;
    }
</style>