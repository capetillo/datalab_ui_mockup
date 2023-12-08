<script setup>
    import ProjectImages from './ProjectImages.vue';
    import ProjectSelector from './ProjectSelector.vue';

    // TODO replace projects with an api call to the users projects
    const projects = [
        { projectTitle: 'project 1', projectDate: '2019', projectDescription: 'a study of the stars'},
        { projectTitle: 'project 2', projectDate: '2019', projectDescription: 'a study of the stars'},
        { projectTitle: 'project 3', projectDate: '2019', projectDescription: 'a study of the stars'},
        { projectTitle: 'project 4', projectDate: '2019', projectDescription: 'a study of the stars'},
        { projectTitle: 'project 5', projectDate: '2019', projectDescription: 'a study of the stars'},
    ]
    // TODO bind this to be equal to the ProjectSelector the user has clicked on
    const selectedProject = 1
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="h-100 pa-6 ma-1" title="Projects">
                    <v-expansion-panels>
                        <!-- TODO depending on the index/project selected a prop should be passed to project-images indicating which project is selected -->
                        <ProjectSelector v-for='(project, index) in projects' :key="index" :project="project"/>
                    </v-expansion-panels>
                </v-card>
            </v-col>
            <v-col>
                <project-images class="h-100 pa-6 ma-1" :selectedProject="selectedProject">
                </project-images>
            </v-col>
        </v-row>
    </v-container>
</template>