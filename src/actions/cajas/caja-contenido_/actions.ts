import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';
import { IRequestCache } from 'src/actions/interfaces';
import { API } from 'src/services/api-data';
import { getAPIData } from 'src/utils/api';
import { hashCode } from 'src/utils/string';

const reqCache: IRequestCache<any> = { cache: {} };
