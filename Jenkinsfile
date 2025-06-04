pipeline{
    environment{
        REPO_URL='https://github.com/ironjemo/api-festivos'
        BRANCH = 'main'
        DOCKER_IMAGE = 'apinewfestivos:latest'
    }

    stages{
        stage('Clonar el repositorio'){
            steps{
                git branch:"${BRANCH}", credentials:"23", url:"${REPO_URL}"
            }
        }

            stage('Construir la imagen de docker'){
                steps{
                    script{
                        bat 'docker build -t %DOCKER_IMAGE%'
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