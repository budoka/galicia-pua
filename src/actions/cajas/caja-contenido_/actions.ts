import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';

import { API } from 'src/services/apis-data';
import { getResourceData } from 'src/utils/api';
import { hashCode } from 'src/utils/string';
