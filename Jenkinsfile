pipeline{

     agent any  // ← ESTA LÍNEA ES OBLIGATORIA

    environment{
        REPO_URL='https://github.com/ironjemo/api-festivos'
        BRANCH = 'main'
        DOCKER_IMAGE = 'apinewfestivos:latest'
    }

    stages{
        stage('Clonar el repositorio'){
            steps{
                git branch:"${BRANCH}", credentialsId:'23', url:"${REPO_URL}"
            }
        }

          stage('Construir la imagen de Docker') {
            steps {
                 script {
                      bat "docker build -t ${DOCKER_IMAGE} ."
        }
    }
}
// agregar steps detener...
            stage('Detener contendor existente'){
                steps{
                    script{
                        catchError (buildResult: 'SUCCESS' , stageResult: 'UNSTABLE'){
                            bat """
                            docker container inspect pipelineapinewcalendario > nul 2>&1 && (
                                docker container stop pipelineapinewcalendario 
                                docker container rm pipelineapinewcalendario 
                            ) || echo "No existe el contenedor 'pipelineapinewcalendario'"
                            """
                        }
                    }
                }
            }

            stage('Crear contenedor'){
                steps{
                    script{
                        bat 'docker container run --network redcalendario --name pipelineapinewcalendario -p 8580:3030 -d %DOCKER_IMAGE% '
                    }
                }
            }
                
    }
}