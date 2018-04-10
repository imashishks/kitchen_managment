angular.module('app.controllers')
    .controller('report', ['$scope', 'httpRequest', '$rootScope', function ($scope, httpRequest, $rootScope) {
        httpRequest.get("/api/report").then(function (params) {
            $scope.report = params.data;
        }, function () {

        })

        $scope.createReport = function () {
            console.log("YES");

            var docDefinition = {
                content: [
                    { text: 'Daily Report', style: 'header' },
                    {

                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,
                            // widths: ['*', 'auto', 100, '*'],

                            body: [
                                ['Name', 'Produced', 'Predicted'],


                            ]
                        }
                    }
                ], styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },

                },
            };
            $scope.report.forEach(function (ele) {
                var tempArr = [ele.name, ele.produced, ele.predicted]
                console.log(tempArr);
                docDefinition.content[1].table.body.push(tempArr);
                console.log(docDefinition)
            });
            pdfMake.createPdf(docDefinition).download('Report.pdf');
        }


    }])