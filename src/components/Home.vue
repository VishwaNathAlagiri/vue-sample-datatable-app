<template>
  <v-card>
    <!--Overlay loader for API CAlls-->
    <v-overlay 
      v-if="isProgress" 
      :opacity="0.5"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
        class="circular-loader"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar 
      v-model="snackbar" 
      top 
      right 
      color="green"
    >
      {{ snackBarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn 
          v-bind="attrs" 
          @click="snackbar = false"
          text
        >Close</v-btn>
      </template>
    </v-snackbar>
    <v-row justify="end">
      <v-col 
        cols="12" 
        lg="6" 
        sm="9"
      >
        <v-text-field
          v-model="search"
          placeholder="Search Data"
          append-icon="mdi-magnify"
          color="primary"
          class="mr-4 ml-6"
        ></v-text-field>
      </v-col>
    </v-row>
    <!--Display sm and above screens-->
    <v-data-table
      @page-count="pageCount = $event"
      :headers="headers"
      :items="updatedUserData"
      :search="search"
      :items-per-page="20"
      :page.sync="page"
      hide-default-footer
      hide-default-header
      class="elevation-1 hidden-xs-only"
    >
      <template v-slot:header="{ props: {} }">
        <thead>
          <tr>
            <th class="text-xs-left">ID</th>
            <th class="text-xs-left">Job Title</th>
            <th class="text-xs-left">Email Address</th>
            <th class="text-xs-left">FirtName LastName</th>
            <th class="text-xs-left">Country</th>
            <th class="text-xs-left">
              Salary For Q1
              <v-checkbox
                v-model="q1"
                @change="calculateSalary"
                class="ml-5 mr-5 ma-0"
              ></v-checkbox>
            </th>
            <th class="text-xs-left">
              Salary For Q2
              <v-checkbox
                v-model="q2"
                @change="calculateSalary"
                class="ml-5 mr-5 ma-0"
              ></v-checkbox>
            </th>
            <th class="text-xs-left">
              Salary For Q3
              <v-checkbox
                v-model="q3"
                @change="calculateSalary"
                class="ml-5 mr-5 ma-0"
              ></v-checkbox>
            </th>
            <th class="text-xs-left">
              Salary For Q4
              <v-checkbox
                v-model="q4"
                @change="calculateSalary"
                class="ml-5 mr-5 ma-0"
              ></v-checkbox>
            </th>
            <th class="text-center">Total Salary<br />{{ totalSalaryOf ? `(${totalSalaryOf})` : "" }}</th>
            <th class="text-center">Total Hours<br />{{ totalSalaryOf ? `(${totalSalaryOf})` : "" }}</th>
            <th class="text-center">Actions <br />(View & Delete)</th>
          </tr>
        </thead>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-col 
            cols="4" 
            lg="4" 
            xl="4" 
            md="5"
            class="d-flex justify-end" 
          >
            <v-select
              v-model="filterBy"
              @change="filter(filterBy)"
              :items="country"
              label="Filter data by country"
              class="ml-5"
            ></v-select>
          </v-col>
          <v-col 
            sm="1" 
            md="1" 
            lg="1" 
            xl="1"
            class="d-flex justify-end"
          >
            <v-menu 
              v-model="menu" 
              offset-y 
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="primary"
                  dark
                  text
                  small
                  class="text-none mt-0 mb-1"
                >
                  Group By
                </v-btn>
              </template>
              <v-card>
                <v-list dense>
                  <v-list-item class="ma-0 pa-0 mr-2 ml-1">
                    <v-list-item-title>
                      <v-checkbox
                        v-model="groupByJobTitle"
                        label="Group By JobTitle"
                      />
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-card-actions>
                  <v-spacer />
                  <v-chip
                    @click="groupBy(groupByJobTitle)"
                    color="primary"
                    outlined
                    :disabled="!groupByJobTitle"
                  >Apply</v-chip>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col
            sm="3"
            md="2"
            lg="1"
            xl="1"
            class="d-flex justify-end mr-0 pr-0"
          >
            <v-dialog 
              v-model="addNewDialog" 
              max-width="1000px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="primary"
                  dark
                  class="mb-2 text-none"
                >Add New Item</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Add new item</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form 
                      v-model="valid" 
                      ref="form"
                    >
                      <v-row>
                        <v-col 
                          cols="12" 
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.ID"
                            :rules="requiredRules"
                            label="ID"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.jobTitle"
                            :rules="jobTitleRules"
                            label="Job Title"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.emailAddress"
                            :rules="emailRules"
                            label="Email Address"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.firstName_lastName"
                            :rules="jobTitleRules"
                            label="First Name Last Name"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-select
                            v-model="addNewItem.country"
                            label="Country"
                            :rules="requiredRules"
                            :items="country"
                          ></v-select>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.salaryForQ1"
                            :rules="requiredRules"
                            type="number"
                            label="Salary For Q1"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.salaryForQ2"
                            type="number"
                            label="Salary For Q2"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.salaryForQ3"
                            type="number"
                            label="Salary For Q3"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.salaryForQ4"
                            type="number"
                            label="Salary For Q4"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.workingHoursQ1"
                            type="number"
                            label="Working Hours Q1"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.workingHoursQ2"
                            type="number"
                            label="Working Hours Q2"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.workingHoursQ3"
                            type="number"
                            label="Working Hours Q3"
                          ></v-text-field>
                        </v-col>
                        <v-col 
                          cols="12" 
                          sm="6" 
                          md="4"
                        >
                          <v-text-field
                            v-model="addNewItem.workingHoursQ4"
                            type="number"
                            label="Working Hours Q4"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="addNewDialog = false"
                    color="blue darken-1"
                    text
                  >
                    Cancel
                  </v-btn>
                  <v-btn 
                    @click="add" 
                    color="blue darken-1" 
                    text
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-dialog 
            v-model="dialog" 
            max-width="1000px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">Working Hour Details</span>
              </v-card-title>
              <v-card-text>
                <v-content 
                  grid-list-md 
                  class="mt-0 pt-5"
                >
                  <v-layout row>
                    <v-flex lg6>
                      <div class="ma-5">
                        <v-layout
                          v-for="(item, index) in Object.keys(viewItem)"
                          row
                          :key="index"
                          class="pa-1"
                        >
                          <v-flex
                            lg6
                            class="font-weight-bold text-capitalize"
                          >{{ item.replace(/([A-Z])/g, " $1").replace(/[^A-Za-z0-9 ]/g, ", ") }}</v-flex>
                          <v-flex lg6>{{ viewItem[item] }} </v-flex>
                        </v-layout>
                      </div>
                    </v-flex>
                    <v-flex 
                      lg6 
                      class="pr-5 pl-0 ml-0"
                    >
                      <div id="chart">
                        <apexchart
                          type="line"
                          height="350"
                          :options="{
                            chart: { height: 350, type: 'line' },
                            stroke: { width: [0, 4] },
                            dataLabels: { enabled: true, enabledOnSeries: [1] },
                            labels: ['Q1', 'Q2', '03', '04'],
                            xaxis: { type: 'Q1, Q2, Q3, Q4' },
                            yaxis: [
                              { title: { text: 'Employee Salary' } },
                              {
                                opposite: true,
                                title: { text: 'Working Hours' },
                              },
                            ],
                          }"
                          :series="series"
                        />
                      </div>
                    </v-flex>
                  </v-layout>
                </v-content>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  @click="dialog = false"
                  color="blue darken-1" 
                  text 
                >Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog 
            v-model="dialogDelete" 
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="dialogDelete = false"
                  color="blue darken-1" 
                  text 
                >Cancel</v-btn>
                <v-btn 
                  @click="deleteItemConfirm"
                  color="blue darken-1" 
                  text 
                >OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider class="mb-5" />
      </template>
      <template 
        v-if="displayColoum" 
        v-slot:item.totalSalary="{ item }"
      >{{ calculateSalary(item).totalSalary }}</template>
      <template 
        v-if="displayColoum" 
        v-slot:item.totalWorkingHours="{ item }"
      >{{ calculateSalary(item).totalWorkingHours }}</template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          @click="view(item)"
          class="mr-2" 
        >mdi-eye</v-icon>
        <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <div class="text-center hidden-xs-only">
      <v-container>
        <v-row justify="center">
          <v-col cols="8">
            <v-container class="max-width">
              <v-pagination
                v-model="page"
                class="my-4"
                :length="pageCount"
              ></v-pagination>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!--Display only for xs screens-->
    <v-data-table
      @page-count="pageCount = $event"
      :headers="headers"
      :items="updatedUserData"
      :search="search"
      :items-per-page="20"
      :page.sync="page"
      hide-default-footer
      class="elevation-1 d-sm-none d-md-none d-lg-none d-xl-non"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-layout 
            row 
            justify-space-between
            class="ma-2 pt-10 mb-0 pb-0" 
          >
            <v-flex 
              xs10 
              lg3
            >
              <v-select
                v-model="filterBy"
                @change="filter(filterBy)"
                :items="country"
                label="Filter data by country"
              ></v-select>
            </v-flex>
            <v-flex 
              xs2 
              lg3
            >
              <v-menu
                v-model="menuMobileScreen"
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    dark
                    text
                    small
                    class="text-none"
                  >
                    Group By
                  </v-btn>
                </template>
                <v-card>
                  <v-list dense>
                    <v-list-item class="ma-0 pa-0 mr-2 ml-1">
                      <v-list-item-title>
                        <v-checkbox
                          v-model="groupByJobTitle"
                          label="Group By JobTitle"
                        />
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                  <v-card-actions>
                    <v-spacer />
                    <v-chip
                      @click="groupBy(groupByJobTitle)"
                      color="primary"
                      outlined
                      :disabled="!groupByJobTitle"
                    >Apply</v-chip>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-flex>
            <v-flex 
              xs12 
              lg3 
              class="mt-0 pt-0"
            >
              <v-dialog 
                v-model="addNewDialogMobileScreen" 
                max-width="1000px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    dark
                    class="mb-2 text-none"
                  >
                    Add New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Add new item</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form 
                        v-model="valid" 
                        ref="form"
                      >
                        <v-row>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.ID"
                              label="ID"
                              :rules="requiredRules"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.jobTitle"
                              :rules="jobTitleRules"
                              label="Job Title"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.emailAddress"
                              :rules="emailRules"
                              label="Email Address"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.firstName_lastName"
                              :rules="jobTitleRules"
                              label="First Name Last Name"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-select
                              v-model="addNewItem.country"
                              label="Country"
                              :rules="requiredRules"
                              :items="country"
                            ></v-select>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.salaryForQ1"
                              :rules="requiredRules"
                              type="number"
                              label="Salary For Q1"
                            ></v-text-field>
                          </v-col>
                         <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.salaryForQ2"
                              type="number"
                              label="Salary For Q2"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.salaryForQ3"
                              type="number"
                              label="Salary For Q3"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.salaryForQ4"
                              type="number"
                              label="Salary For Q4"
                            ></v-text-field>
                          </v-col>
                         <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.workingHoursQ1"
                              type="number"
                              label="Working Hours Q1"
                            ></v-text-field>
                          </v-col>
                         <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.workingHoursQ2"
                              type="number"
                              label="Working Hours Q2"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.workingHoursQ3"
                              type="number"
                              label="Working Hours Q3"
                            ></v-text-field>
                          </v-col>
                          <v-col 
                            cols="12" 
                            sm="6" 
                            md="4"
                          >
                            <v-text-field
                              v-model="addNewItem.workingHoursQ4"
                              type="number"
                              label="Working Hours Q4"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      @click="addNewDialogMobileScreen = false"
                      color="blue darken-1"
                      text
                    >Cancel</v-btn>
                    <v-btn 
                      @click="add"
                      color="blue darken-1" 
                      text 
                    >Add</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-flex>
          </v-layout>
          <v-dialog 
            v-model="dialog" 
            max-width="1000px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">Working Hour Details</span>
              </v-card-title>
              <v-card-text>
                <v-content 
                  grid-list-md 
                  class="mt-0 pt-5"
                >
                  <v-layout row>
                    <v-flex lg6>
                      <div class="ma-5">
                        <v-layout
                          v-for="(item, index) in Object.keys(viewItem)"
                          row
                          :key="index"
                          class="pa-1"
                        >
                          <v-flex
                            lg6
                            class="font-weight-bold text-capitalize"
                          >{{ item.replace(/([A-Z])/g, " $1").replace(/[^A-Za-z0-9 ]/g, ", ") }}</v-flex>
                          <v-flex lg6>{{ viewItem[item] }} </v-flex>
                        </v-layout>
                      </div>
                    </v-flex>
                    <v-flex lg6 class="pr-5 pl-0 ml-0">
                      <div id="chart">
                        <apexchart
                          type="line"
                          height="350"
                          :options="{
                            chart: { height: 350, type: 'line' },
                            stroke: { width: [0, 4] },
                            dataLabels: { enabled: true, enabledOnSeries: [1] },
                            labels: ['Q1', 'Q2', '03', '04'],
                            xaxis: { type: 'Q1, Q2, Q3, Q4' },
                            yaxis: [
                              { title: { text: 'Employee Salary' } },
                              {
                                opposite: true,
                                title: { text: 'Working Hours' },
                              },
                            ],
                          }"
                          :series="series"
                        />
                      </div>
                    </v-flex>
                  </v-layout>
                </v-content>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  @click="dialog = false"
                  color="blue darken-1" 
                  text 
                >Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog 
            v-model="dialogDelete" 
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  @click="dialogDelete = false"
                  color="blue darken-1" 
                  text 
                >Cancel</v-btn>
                <v-btn 
                  color="blue darken-1" 
                  text 
                  @click="deleteItemConfirm"
                >OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider class="mb-5" />
      </template>
      <template 
        v-if="displayColoum" 
        v-slot:item.totalSalary="{ item }"
      >{{ calculateSalary(item).totalSalary }}</template>
      <template 
        v-if="displayColoum" 
        v-slot:item.totalWorkingHours="{ item }"
      >{{ calculateSalary(item).totalWorkingHours }}</template>
      <template v-slot:item.actions="{ item }">
        <v-icon 
          @click="view(item)"
          class="mr-2"
        >mdi-eye</v-icon>
        <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <div class="text-center d-sm-none d-md-none d-lg-none d-xl-none">
      <v-container>
        <v-row justify="center">
          <v-col cols="11">
            <v-pagination
              v-model="page"
              class="my-2"
              :length="pageCount"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import compute from "@/mixin/compute.js";
import axios from "axios";

export default {
  name: "Home",
  mixins: [compute],
  props: {
    userData: {
      type: Array,
      default: () => {},
    },
  },
  components: {
    apexchart: VueApexCharts,
  },
  data: () => ({
    valid: false,
    page: 1,
    pageCount: 0,
    isProgress: false,
    addNewItem: {
      ID: "",
      jobTitle: "",
      emailAddress: "",
      firstName_lastName: "",
      country: "",
      salaryForQ1: "",
      salaryForQ2: "",
      salaryForQ3: "",
      salaryForQ4: "",
      workingHoursQ1: "",
      workingHoursQ2: "",
      workingHoursQ3: "",
      workingHoursQ4: "",
    },
    requiredRules: [(v) => !!v || "Required"],
    jobTitleRules: [
      (v) => !!v || "Required",
      (v) => /[A-Za-z0-9 ]$/.test(v) || "Invalid Input",
    ],
    emailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+/.test(v) || "Invalid Input",
    ],
    addNewDialog: false,
    addNewDialogMobileScreen: false,
    snackbar: false,
    snackBarMessage: "",
    enableFilter: false,
    filterBy: "",
    groupByJobTitle: false,
    menu: false,
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    displayColoum: false,
    viewItem: {},
    totalSalaryOf: "",
    series: [],
    search: "",
    dialog: false,
    dialogDelete: false,
    editedIndex: "",
    updatedUserData: [],
    menuMobileScreen: false,
    country: [
      "Armenia",
      "Australia",
      "Austria",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Austrian Empire",
      "Nassau",
      "Nauru",
      "Nepal",
      "Netherlands",
      "The New Zealand",
      "Azerbaijan",
      "India",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
    ],
    headers: [
      { text: "ID", value: "ID", sortable: false },
      { text: "Job Title", value: "jobTitle", sortable: false },
      { text: "Email Address", value: "emailAddress", sortable: false },
      { text: "FirtName LastName", value: "firstName_lastName", sortable: false },
      { text: "Country", value: "country", sortable: false },
      { text: "Salary in Q1", value: "salaryForQ1", sortable: false },
      { text: "Salary in Q2", value: "salaryForQ2", sortable: false },
      { text: "Salary in Q3", value: "salaryForQ3", sortable: false },
      { text: "Salary in Q4", value: "salaryForQ4", sortable: false },
      { text: "Total Salary", value: "totalSalary", sortable: false },
      { text: "Total Hours", value: "totalWorkingHours", sortable: false },
      { text: "Actions(View & Delete)", value: "actions", sortable: false },
    ],
  }),
  mounted() {
    this.updatedUserData = this.userData;
  },
  methods: {
    deleteItem(item) {
      this.editedIndex = this.userData.indexOf(item);
      this.deleteElement = item;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.isProgress = true;
      axios({
        method: "DELETE",
        url: "http://localhost:8001/update",
        data: this.deleteElement,
      })
        .then((res) => {
          this.isProgress = false;
          this.snackBar = true;
          this.snackBarMessage = res.data;
        })
        .catch((e) => {
          this.isProgress = false;
          console.log(e);
        });
      this.snackBar = true;
      this.snackBarMessage = "Deleted Successfully!!!";
      this.userData.splice(this.editedIndex, 1);
      this.dialogDelete = false;
    },
    view(item) {
      const { salaryForQ1, salaryForQ2, salaryForQ3, salaryForQ4, workingHoursQ1, workingHoursQ2, workingHoursQ3, workingHoursQ4 } = item;
      this.viewItem = item;
      this.dialog = true;
      this.series = [
        {
          name: "Employee Salary",
          type: "column",
          data: [salaryForQ1, salaryForQ2, salaryForQ3, salaryForQ4],
        },
        {
          name: "Quarters",
          type: "line",
          data: [workingHoursQ1, workingHoursQ2, workingHoursQ3, workingHoursQ4],
        },
      ];
    },
    groupBy(groupByJobTitle) { //Api call for grouping data by job title
      this.menu = false;
      this.menuMobileScreen = false;
      this.isProgress = true;
      if (groupByJobTitle) {
        axios({
          method: "GET",
          url: `http://localhost:8001/groupBy/jobTitle`,
        })
          .then((res) => {
            this.isProgress = false;
            this.updatedUserData = res.data;
          })
          .catch((e) => {
            this.isProgress = false;
            console.log(e);
          });
      }
    },
    filter(filterBy) {// Api call for filtering by country
      this.menu = false;
      this.isProgress = true;
      axios({
        method: "GET",
        url: `http://localhost:8001/filterBy/${filterBy}`,
      })
        .then((res) => {
          this.isProgress = false;
          this.updatedUserData = res.data;
        })
        .catch((e) => {
          this.isProgress = false;
          console.log(e);
        });
    },
    add() { //Api call for adding new item
      if (this.$refs.form.validate()) {
        this.addNewDialog = false;
        this.isProgress = true;
        axios({
          method: "POST",
          url: "http://localhost:8001/add",
          data: this.addNewItem,
        })
          .then((res) => {
            this.isProgress = false;
            this.snackbar = true;
            this.updatedUserData = res.data;
          })
          .catch((e) => {
            console.log(e)
            this.isProgress = false;
          });
      }
    },
  },
};
</script>
